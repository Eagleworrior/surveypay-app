# backend/app.py
import os
import hmac
import hashlib
from flask import Flask, request, jsonify, send_from_directory, abort
from payments import init_paystack_transaction, verify_paystack_transaction

app = Flask(__name__, static_folder='../frontend', static_url_path='/')

# Minimum withdrawal mapping (server-side enforcement)
MIN_WITHDRAWAL = {
    'KE': 18000,  # KES
    'NG': 5000,   # NGN example
    'US': 200,    # USD example
    'UG': 50000,  # UGX example
    'TZ': 50000   # TZS example
}

# In-memory demo stores (replace with DB in production)
USERS = {}
SURVEYS = {
    'tech': {
        "title": "Tech Trends Survey",
        "pages": [
            {
                "name": "page1",
                "elements": [
                    {"type": "text", "name": "q1", "title": "What tech do you use?"},
                    {"type": "radiogroup", "name": "q2", "title": "Favorite OS?", "choices": ["Windows", "macOS", "Linux", "Other"]}
                ]
            }
        ]
    },
    'shopping': {
        "title": "Shopping Habits Survey",
        "pages": [
            {
                "name": "p1",
                "elements": [
                    {"type": "text", "name": "q1", "title": "Where do you shop online?"},
                    {"type": "rating", "name": "q2", "title": "How often do you shop?"}
                ]
            }
        ]
    }
}

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# Public config endpoint (exposes only public key and paybill)
@app.route('/api/config', methods=['GET'])
def config():
    return jsonify({
        "paystackPublicKey": os.getenv('PAYSTACK_PUBLIC_KEY'),
        "paybillNumber": os.getenv('PAYBILL_NUMBER', '880100')
    })

# Survey endpoints
@app.route('/api/surveys/<survey_id>', methods=['GET'])
def get_survey(survey_id):
    s = SURVEYS.get(survey_id)
    if not s:
        return jsonify({"error": "not found"}), 404
    return jsonify(s)

@app.route('/api/submit-survey', methods=['POST'])
def submit_survey():
    data = request.json or {}
    user = data.get('user', 'guest')
    survey_data = data.get('survey', {})
    # In production: persist response, compute reward, queue payout
    reward = 3.5
    # Demo: credit user balance in memory
    USERS.setdefault(user, {})
    USERS[user]['balance'] = USERS[user].get('balance', 0) + reward
    return jsonify(success=True, reward=reward)

# Unlock endpoint (manual Paybill verification placeholder)
@app.route('/api/unlock', methods=['POST'])
def unlock():
    data = request.json or {}
    user = data.get('user', 'guest')
    tx_code = data.get('txCode')
    country = data.get('country', 'KE')
    if not tx_code or len(tx_code) < 4:
        return jsonify(success=False, message='Invalid transaction code'), 400
    # In production: verify tx_code with Safaricom Daraja or aggregator
    USERS.setdefault(user, {})
    USERS[user]['unlocked'] = True
    return jsonify(success=True, message='Unlocked')

# Paystack init (server-side)
@app.route('/api/paystack-init', methods=['POST'])
def paystack_init():
    data = request.json or {}
    amount = float(data.get('amount', 0))
    email = data.get('email', 'user@example.com')
    if amount <= 0:
        return jsonify(success=False, message='Invalid amount'), 400
    # amount in kobo/cents
    ref = init_paystack_transaction(email, int(amount * 100))
    if not ref:
        return jsonify(success=False, message='Paystack init failed'), 500
    return jsonify(success=True, authorization_url=ref['authorization_url'], reference=ref['reference'])

# Paystack webhook (verify signature)
@app.route('/webhook/paystack', methods=['POST'])
def paystack_webhook():
    secret = os.getenv('PAYSTACK_SECRET_KEY')
    signature = request.headers.get('x-paystack-signature', '')
    payload = request.get_data()
    if secret:
        computed = hmac.new(secret.encode(), payload, hashlib.sha512).hexdigest()
        if not hmac.compare_digest(computed, signature):
            abort(400)
    event = request.json or {}
    # Handle charge.success
    if event.get('event') == 'charge.success':
        ref = event['data']['reference']
        ok = verify_paystack_transaction(ref)
        if ok:
            # TODO: credit user, unlock features, persist transaction
            pass
    return jsonify(status='ok')

# Withdraw endpoint (server-side enforcement)
@app.route('/api/withdraw', methods=['POST'])
def withdraw():
    data = request.json or {}
    user = data.get('user', 'guest')
    amount = float(data.get('amount', 0))
    country = data.get('country', 'KE')
    min_amt = MIN_WITHDRAWAL.get(country, MIN_WITHDRAWAL['KE'])
    if amount < min_amt:
        return jsonify(success=False, message=f'Minimum withdrawal for your country is {min_amt}'), 400
    # In production: create withdrawal job, call payment provider
    return jsonify(success=True, message='Withdrawal request queued')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
