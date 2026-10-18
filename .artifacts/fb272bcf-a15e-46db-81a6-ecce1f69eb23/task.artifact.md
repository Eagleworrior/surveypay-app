# Task List

- [ ] Set `MPESA_SHORTCODE=1074748` (Store Number) and `MPESA_PARTYB=4414485` (Till Number) in `.env`
- [ ] Update `server.js` STK Push and STK Query parameters to use Store Number `1074748` for `BusinessShortCode` and Till Number `4414485` for `PartyB`
- [ ] Update `index.html` `DARAJA_CONFIG`, `triggerDirectStkPush()`, and `queryDirectStkStatus()` to use Store Number `1074748` for `BusinessShortCode` and `Password`, and Till Number `4414485` for `PartyB`
- [ ] Sync `index.html` to `app/src/main/assets/index.html`
- [ ] Compile release APK and export to `C:\Users\EAGLE\Downloads\SurveyPay-Signed.apk`
- [ ] Commit and push clean state to GitHub (`origin/main`)
