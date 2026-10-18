import express from "express";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";

const E = process.env;
for (const k of ["JWT_SECRET","CALLBACK_SECRET","PUBLIC_URL","ANTHROPIC_API_KEY","MPESA_KEY","MPESA_SECRET","MPESA_SHORTCODE","MPESA_PASSKEY"])
  if (!E[k]) { console.error("Missing env var: " + k); process.exit(1); }

const FEE = +E.ACTIVATION_FEE || 200, FREE = +E.FREE_SURVEYS || 3, MIN = +E.MIN_WITHDRAW || 500;
const NQ = 50, VARIANTS = 3, MIN_SECONDS = 120, DARAJA = "https://api.safaricom.co.ke";
const DEFAULTS = [["Mobile Money Habits","Finance",120],["Online Shopping","Retail",90],["Healthcare Access","Health",150],["Streaming & Entertainment","Media",80],["Public Transport","Transport",100],["Education & Skills","Education",110],["Food & Dining","Lifestyle",70],["Smartphone Usage","Technology",95],["Farming & Agribusiness","Agriculture",140],["Energy & Utilities","Utilities",130],["Social Media","Media",75],["Small Business Needs","Business",160]];

const db = new Database("surveypay.db");
db.pragma("journal_mode = WAL");
db.exec(`
create table if not exists users(id integer primary key, name text, email text unique, phone text, pw text, balance integer default 0, active integer default 0);
create table if not exists qsets(id integer primary key, survey_id integer, json text);
create table if not exists starts(user_id integer, survey_id integer, qset_id integer, t integer, primary key(user_id, survey_id));
create table if not exists completions(user_id integer, survey_id integer, amount integer, t integer, primary key(user_id, survey_id));
create table if not exists withdrawals(id integer primary key, user_id integer, amount integer, dest text, status text, ref text unique, t integer default (strftime('%s','now')*1000));
create table if not exists payments(checkout_id text primary key, user_id integer, status text, receipt text);
create table if not exists surveys(id integer primary key, title text, type text, pay integer, sponsor text, budget integer default 0, spent integer default 0, active integer default 1);
create table if not exists sponsor_funds(id integer primary key, survey_id integer, amount integer, note text, t integer default (strftime('%s','now')*1000));
`);
// Default surveys start with NO sponsor budget, so they stay hidden until a sponsor funds them (see /admin.html).
if (!db.prepare("select 1 from surveys").get()) { const ins = db.prepare("insert into surveys(title,type,pay,sponsor) values(?,?,?,'SurveyPay')"); DEFAULTS.forEach(d => ins.run(...d)); }
const S1 = id => db.prepare("select * from surveys where id=?").get(id);
const avail = s => !!s && s.active === 1 && s.budget - s.spent >= s.pay;

const app = express();
app.use(express.json({ limit: "50kb" }));
app.use(express.static("public"));
app.use((req, res, next) => {
  res.set({ "Access-Control-Allow-Origin": E.ALLOWED_ORIGIN || "", "Access-Control-Allow-Headers": "Authorization, Content-Type", "Access-Control-Allow-Methods": "GET,POST" });
  req.method === "OPTIONS" ? res.sendStatus(204) : next();
});
const limiter = rateLimit({ windowMs: 15 * 60e3, limit: 30 });

// ---------- helpers ----------
const norm = p => { const s = String(p || "").replace(/[\s+]/g, ""); return /^(254|0)[17]\d{8}$/.test(s) ? "254" + s.replace(/^(254|0)/, "") : null; };
const sign = u => jwt.sign({ id: u.id }, E.JWT_SECRET, { expiresIn: "7d" });
const pub = u => ({ name: u.name, email: u.email, phone: u.phone, balance: u.balance, active: !!u.active });
const doneCount = id => db.prepare("select count(*) c from completions where user_id=?").get(id).c;
function auth(req, res, next) {
  try {
    const { id } = jwt.verify((req.get("Authorization") || "").replace("Bearer ", ""), E.JWT_SECRET);
    req.user = db.prepare("select * from users where id=?").get(id);
    return req.user ? next() : res.sendStatus(401);
  } catch { res.sendStatus(401); }
}
const stamp = () => new Date(Date.now() + 3 * 3600e3).toISOString().replace(/\D/g, "").slice(0, 14);

// ---------- Daraja ----------
let tok = { v: null, exp: 0 };
async function token() {
  if (tok.v && Date.now() < tok.exp) return tok.v;
  const r = await fetch(`${DARAJA}/oauth/v1/generate?grant_type=client_credentials`, { headers: { Authorization: "Basic " + Buffer.from(`${E.MPESA_KEY}:${E.MPESA_SECRET}`).toString("base64") } });
  const j = await r.json();
  if (!j.access_token) throw new Error("Daraja auth failed");
  tok = { v: j.access_token, exp: Date.now() + (+j.expires_in - 60) * 1000 };
  return tok.v;
}
const daraja = async (path, body) => (await fetch(DARAJA + path, { method: "POST", headers: { Authorization: "Bearer " + await token(), "Content-Type": "application/json" }, body: JSON.stringify(body) })).json();
const cb = p => `${E.PUBLIC_URL}/cb/${E.CALLBACK_SECRET}/${p}`;

// ---------- Claude question generation ----------
async function generateSet(s) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": E.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({ model: E.CLAUDE_MODEL || "claude-sonnet-5-5", max_tokens: 8000, messages: [{ role: "user", content:
          `Write a market-research survey titled "${s.title}" (${s.type}) for adult Kenyan respondents. Return ONLY a JSON array of exactly ${NQ} objects shaped {"q": string, "c": [3 to 6 answer strings]}. Mix demographics, behaviour, brand choice, frequency, spending, yes/no and opinion questions. Do NOT make most questions satisfaction or importance scales. Use neutral wording, no duplicates. Variation seed: ${crypto.randomUUID()}` }] })
      });
      const j = await r.json();
      const q = JSON.parse(j.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim());
      if (Array.isArray(q) && q.length >= NQ && q.every(x => typeof x.q === "string" && Array.isArray(x.c) && x.c.length >= 2 && x.c.every(c => typeof c === "string")))
        return q.slice(0, NQ).map(x => ({ q: x.q, c: x.c }));
    } catch (e) { console.error("generate:", e.message); }
  }
  throw new Error("generation failed");
}
async function qsetFor(s) {
  const n = db.prepare("select count(*) c from qsets where survey_id=?").get(s.id).c;
  if (n < VARIANTS) {
    const q = await generateSet(s);
    const r = db.prepare("insert into qsets(survey_id,json) values(?,?)").run(s.id, JSON.stringify(q));
    return { id: r.lastInsertRowid, q };
  }
  const row = db.prepare("select * from qsets where survey_id=? order by random() limit 1").get(s.id);
  return { id: row.id, q: JSON.parse(row.json) };
}

// ---------- accounts ----------
app.get("/api/config", (_, res) => res.json({ activationFee: FEE, freeSurveys: FREE, minWithdraw: MIN }));
app.post("/api/signup", limiter, (req, res) => {
  const { name, email, phone, password, confirm } = req.body || {};
  const em = String(email || "").trim().toLowerCase(), ph = norm(phone);
  if (!String(name || "").trim()) return res.status(400).json({ error: "Enter your full name." });
  if (!/^\S+@\S+\.\S+$/.test(em)) return res.status(400).json({ error: "Enter a valid email." });
  if (!ph) return res.status(400).json({ error: "Enter a valid Kenyan phone number." });
  if (String(password || "").length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });
  if (password !== confirm) return res.status(400).json({ error: "Passwords do not match." });
  if (db.prepare("select 1 from users where email=?").get(em)) return res.status(409).json({ error: "An account with this email exists." });
  const r = db.prepare("insert into users(name,email,phone,pw) values(?,?,?,?)").run(name.trim(), em, ph, bcrypt.hashSync(password, 12));
  const u = db.prepare("select * from users where id=?").get(r.lastInsertRowid);
  res.json({ token: sign(u), user: pub(u) });
});
app.post("/api/login", limiter, (req, res) => {
  const u = db.prepare("select * from users where email=?").get(String(req.body?.email || "").trim().toLowerCase());
  if (!u || !bcrypt.compareSync(String(req.body?.password || ""), u.pw)) return res.status(401).json({ error: "Wrong email or password." });
  res.json({ token: sign(u), user: pub(u) });
});
app.get("/api/me", auth, (req, res) => res.json({ user: pub(req.user), surveysDone: doneCount(req.user.id) }));

// ---------- surveys ----------
app.get("/api/surveys", auth, (req, res) => {
  const done = new Set(db.prepare("select survey_id from completions where user_id=?").all(req.user.id).map(r => r.survey_id));
  res.json(db.prepare("select * from surveys").all().filter(s => avail(s) || done.has(s.id)).map(s => ({ id: s.id, title: s.title, type: s.type, pay: s.pay, questions: NQ, done: done.has(s.id) })));
});
const gate = (u, sid) => {
  if (db.prepare("select 1 from completions where user_id=? and survey_id=?").get(u.id, sid)) return "You already completed this survey.";
  if (!u.active && doneCount(u.id) >= FREE) return "ACTIVATE";
};
app.get("/api/surveys/:id/questions", auth, async (req, res) => {
  const s = S1(+req.params.id); if (!avail(s)) return res.status(404).json({ error: "This survey is not available." });
  const g = gate(req.user, s.id);
  if (g === "ACTIVATE") return res.status(402).json({ error: `Activate your account (KES ${FEE}) to continue.`, needsActivation: true });
  if (g) return res.status(400).json({ error: g });
  try {
    let st = db.prepare("select * from starts where user_id=? and survey_id=?").get(req.user.id, s.id);
    if (!st) { const set = await qsetFor(s); db.prepare("insert into starts values(?,?,?,?)").run(req.user.id, s.id, set.id, Date.now()); st = { qset_id: set.id }; }
    res.json({ title: s.title, pay: s.pay, questions: JSON.parse(db.prepare("select json from qsets where id=?").get(st.qset_id).json) });
  } catch { res.status(503).json({ error: "Could not load the survey. Try again shortly." }); }
});
app.post("/api/surveys/:id/submit", auth, (req, res) => {
  const s = S1(+req.params.id); if (!avail(s)) return res.status(404).json({ error: "This survey is not available." });
  const g = gate(req.user, s.id); if (g) return res.status(g === "ACTIVATE" ? 402 : 400).json({ error: g === "ACTIVATE" ? "Activate your account first." : g });
  const st = db.prepare("select * from starts where user_id=? and survey_id=?").get(req.user.id, s.id);
  if (!st) return res.status(400).json({ error: "Start the survey first." });
  const qs = JSON.parse(db.prepare("select json from qsets where id=?").get(st.qset_id).json), a = req.body?.answers;
  if (!Array.isArray(a) || a.length !== qs.length || !a.every((x, i) => Number.isInteger(x) && x >= 0 && x < qs[i].c.length)) return res.status(400).json({ error: "Answer every question." });
  if (Date.now() - st.t < MIN_SECONDS * 1000) return res.status(400).json({ error: "Please take your time and answer carefully." });
  const paid = db.transaction(() => {
    if (!db.prepare("update surveys set spent=spent+pay where id=? and active=1 and budget-spent>=pay").run(s.id).changes) return false;
    db.prepare("insert into completions values(?,?,?,?)").run(req.user.id, s.id, s.pay, Date.now());
    db.prepare("update users set balance=balance+? where id=?").run(s.pay, req.user.id);
    return true;
  })();
  if (!paid) return res.status(409).json({ error: "This survey has just closed. Try another one." });
  res.json({ earned: s.pay, balance: req.user.balance + s.pay });
});
app.get("/api/history", auth, (req, res) => res.json({
  surveys: db.prepare("select c.survey_id id, c.amount, c.t from completions c where user_id=? order by t desc").all(req.user.id).map(r => ({ ...r, title: (S1(r.id) || {}).title })),
  withdrawals: db.prepare("select amount, dest, status, t from withdrawals where user_id=? order by t desc").all(req.user.id)
}));

// ---------- activation (STK Push) ----------
app.post("/api/activate", auth, async (req, res) => {
  const u = req.user; if (u.active) return res.status(400).json({ error: "Already activated." });
  const phone = norm(req.body?.phone || u.phone); if (!phone) return res.status(400).json({ error: "Enter a valid M-Pesa number." });
  try {
    const ts = stamp();
    const j = await daraja("/mpesa/stkpush/v1/processrequest", {
      BusinessShortCode: E.MPESA_SHORTCODE, Password: Buffer.from(E.MPESA_SHORTCODE + E.MPESA_PASSKEY + ts).toString("base64"), Timestamp: ts,
      TransactionType: E.MPESA_TXN_TYPE || "CustomerBuyGoodsOnline", Amount: FEE, PartyA: phone, PartyB: E.MPESA_PARTYB || E.MPESA_SHORTCODE,
      PhoneNumber: phone, CallBackURL: cb("stk"), AccountReference: "SurveyPay", TransactionDesc: "Account activation"
    });
    if (j.ResponseCode !== "0") throw new Error(j.errorMessage || j.ResponseDescription);
    db.prepare("insert into payments(checkout_id,user_id,status) values(?,?,'pending')").run(j.CheckoutRequestID, u.id);
    res.json({ message: "Enter your M-Pesa PIN on your phone to complete payment.", checkoutId: j.CheckoutRequestID });
  } catch (e) { console.error("stk:", e.message); res.status(502).json({ error: "Could not start the payment. Try again." }); }
});

app.get("/api/activate/status/:checkoutId", auth, async (req, res) => {
  const checkoutId = req.params.checkoutId;
  const p = db.prepare("select * from payments where checkout_id=?").get(checkoutId);
  if (!p) return res.status(404).json({ error: "Payment checkout record not found." });

  if (p.status === "paid") {
    return res.json({ status: "paid", message: "Account Activated Successfully!" });
  }
  if (p.status === "failed") {
    return res.json({ status: "failed", error: "Payment Failed: Insufficient M-Pesa balance or transaction canceled." });
  }

  try {
    const ts = stamp();
    const j = await daraja("/mpesa/stkpushquery/v1/query", {
      BusinessShortCode: E.MPESA_SHORTCODE,
      Password: Buffer.from(E.MPESA_SHORTCODE + E.MPESA_PASSKEY + ts).toString("base64"),
      Timestamp: ts,
      CheckoutRequestID: checkoutId
    });

    const rc = String(j.ResultCode);
    if (rc === "0") {
      db.transaction(() => {
        db.prepare("update payments set status='paid' where checkout_id=?").run(checkoutId);
        db.prepare("update users set active=1 where id=?").run(p.user_id);
      })();
      return res.json({ status: "paid", message: "Account Activated Successfully!" });
    } else if (rc && rc !== "undefined" && rc !== "null") {
      db.prepare("update payments set status='failed' where checkout_id=?").run(checkoutId);
      let errorMsg = j.ResultDesc || "Payment Failed: Transaction failed.";
      if (rc === "1") errorMsg = "Payment Failed: Insufficient M-Pesa balance. Please top up and try again.";
      if (rc === "2001") errorMsg = "Payment Failed: Wrong M-Pesa PIN entered. Please try again.";
      if (rc === "1032") errorMsg = "Payment Failed: Transaction canceled on phone.";
      if (rc === "1037") errorMsg = "Payment Failed: M-Pesa PIN prompt timed out.";
      return res.json({ status: "failed", error: errorMsg });
    }
  } catch (e) {
    console.error("STK Query:", e.message);
  }

  return res.json({ status: "pending", message: "Waiting for M-Pesa PIN input..." });
});
app.post("/cb/:s/stk", (req, res) => {
  if (req.params.s !== E.CALLBACK_SECRET) return res.sendStatus(404);
  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  const c = req.body?.Body?.stkCallback; if (!c) return;
  const p = db.prepare("select * from payments where checkout_id=? and status='pending'").get(c.CheckoutRequestID); if (!p) return;
  const item = n => c.CallbackMetadata?.Item?.find(i => i.Name === n)?.Value;
  if (c.ResultCode !== 0 || +item("Amount") < FEE) return void db.prepare("update payments set status='failed' where checkout_id=?").run(p.checkout_id);
  db.transaction(() => {
    db.prepare("update payments set status='paid', receipt=? where checkout_id=?").run(String(item("MpesaReceiptNumber")), p.checkout_id);
    db.prepare("update users set active=1 where id=?").run(p.user_id);
  })();
});

// ---------- withdrawals (B2C) ----------
const settle = (ref, status) => db.transaction(() => {
  const w = db.prepare("select * from withdrawals where ref=? and status='processing'").get(ref); if (!w) return;
  db.prepare("update withdrawals set status=? where ref=?").run(status, ref);
  if (status === "failed") db.prepare("update users set balance=balance+? where id=?").run(w.amount, w.user_id);
})();
app.post("/api/withdraw", auth, async (req, res) => {
  const u = req.user, amt = Math.floor(+req.body?.amount);
  if (!(amt >= MIN)) return res.status(400).json({ error: `Minimum withdrawal is KES ${MIN.toLocaleString("en-KE")}.` });
  if (req.body?.method !== "mpesa") return res.status(501).json({ error: "Bank payouts are not enabled yet. Please withdraw to M-Pesa." });
  const ref = crypto.randomUUID();
  const ok = db.transaction(() => {
    if (!db.prepare("update users set balance=balance-? where id=? and balance>=?").run(amt, u.id, amt).changes) return false;
    db.prepare("insert into withdrawals(user_id,amount,dest,status,ref) values(?,?,?,'processing',?)").run(u.id, amt, "M-Pesa +" + u.phone, ref);
    return true;
  })();
  if (!ok) return res.status(400).json({ error: "Amount is more than your balance." });
  try {
    const j = await daraja("/mpesa/b2c/v1/paymentrequest", {
      OriginatorConversationID: ref, InitiatorName: E.MPESA_INITIATOR, SecurityCredential: E.MPESA_SECURITY_CREDENTIAL, CommandID: "BusinessPayment",
      Amount: amt, PartyA: E.MPESA_B2C_SHORTCODE || E.MPESA_SHORTCODE, PartyB: u.phone, Remarks: "SurveyPay withdrawal",
      QueueTimeOutURL: cb("timeout"), ResultURL: cb("b2c"), Occassion: "Withdrawal"
    });
    if (j.ResponseCode !== "0") throw new Error(j.errorMessage || j.ResponseDescription);
    res.json({ ok: true, message: "Withdrawal successful. Payment will take up to six hours to reach your phone." });
  } catch (e) { console.error("b2c:", e.message); settle(ref, "failed"); res.status(502).json({ error: "Withdrawal could not be started. Your balance was not charged." }); }
});
app.post("/cb/:s/b2c", (req, res) => {
  if (req.params.s !== E.CALLBACK_SECRET) return res.sendStatus(404);
  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  const r = req.body?.Result; if (r?.OriginatorConversationID) settle(r.OriginatorConversationID, r.ResultCode === 0 ? "paid" : "failed");
});
app.post("/cb/:s/timeout", (req, res) => { res.json({ ResultCode: 0, ResultDesc: "Accepted" }); console.warn("B2C timeout:", JSON.stringify(req.body)); });

// ---------- admin (set ADMIN_TOKEN in .env; open /admin.html) ----------
const adm = (req, res, next) => {
  const a = Buffer.from(req.get("x-admin-token") || ""), b = Buffer.from(E.ADMIN_TOKEN || "");
  return E.ADMIN_TOKEN && a.length === b.length && crypto.timingSafeEqual(a, b) ? next() : res.sendStatus(401);
};
const one = (q, ...a) => db.prepare(q).get(...a);
app.get("/admin/summary", limiter, adm, (_, res) => {
  const bal = one("select count(*) n, coalesce(sum(balance),0) v from users"), sv = one("select coalesce(sum(budget),0) b, coalesce(sum(spent),0) s from surveys");
  const wd = st => one("select coalesce(sum(amount),0) v from withdrawals where status=?", st).v;
  const act = one("select count(*) n from payments where status='paid'").n * FEE, fundsIn = act + sv.b, paidOut = wd("paid"), processing = wd("processing");
  res.json({ users: bal.n, userBalances: bal.v, activationRevenue: act, sponsorFunding: sv.b, surveyPayoutsCredited: sv.s, sponsorBudgetLeft: sv.b - sv.s,
    withdrawalsPaid: paidOut, withdrawalsProcessing: processing, owedToUsers: bal.v + processing, indicativeSurplus: fundsIn - paidOut - bal.v - processing });
});
app.get("/admin/surveys", limiter, adm, (_, res) => res.json(db.prepare("select * from surveys order by id desc").all()));
app.post("/admin/surveys", limiter, adm, (req, res) => {
  const { title, type, sponsor } = req.body || {}, pay = Math.floor(+req.body?.pay), budget = Math.floor(+req.body?.budget || 0);
  if (!String(title || "").trim() || !String(type || "").trim() || !(pay >= 1) || budget < 0) return res.status(400).json({ error: "Title, type and a pay amount are required." });
  const r = db.prepare("insert into surveys(title,type,pay,sponsor,budget) values(?,?,?,?,?)").run(title.trim(), type.trim(), pay, String(sponsor || "").trim(), budget);
  if (budget) db.prepare("insert into sponsor_funds(survey_id,amount,note) values(?,?,'initial')").run(r.lastInsertRowid, budget);
  res.json({ id: r.lastInsertRowid });
});
app.post("/admin/surveys/:id/fund", limiter, adm, (req, res) => {
  const amt = Math.floor(+req.body?.amount); if (!(amt > 0) || !S1(+req.params.id)) return res.status(400).json({ error: "Enter a valid amount." });
  db.transaction(() => { db.prepare("update surveys set budget=budget+? where id=?").run(amt, +req.params.id); db.prepare("insert into sponsor_funds(survey_id,amount,note) values(?,?,?)").run(+req.params.id, amt, String(req.body?.note || "")); })();
  res.json({ ok: true });
});
app.post("/admin/surveys/:id/toggle", limiter, adm, (req, res) => { db.prepare("update surveys set active=1-active where id=?").run(+req.params.id); res.json({ ok: true }); });

app.listen(E.PORT || 3000, () => console.log("SurveyPay server running"));
