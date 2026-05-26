# backend/app.py
import os
import hmac, hashlib, json
from flask import Flask, request, jsonify, abort
from payments import init_paystack_transaction, verify_paystack_transaction

app = Flask(__name__)
MIN_WITHDRAWAL = {
    'KE': 18000,  # KES
    'NG': 5000,   # NGN example
    'US': 200,    # USD example
}

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json or {}
    # Minimal: in production use DB
    username = data.get('username') or 'Guest'
    return jsonify(success=True, username=username)

@app.route('/api/unlock', methods=['POST'])
def unlock():
    data = request.json or {}
    tx_code = data.get('txCode')
    country = data.get('country','KE')
    # In production: verify Paybill transaction via M-Pesa API or Paystack if used
    # Here we simulate verification by checking tx_code format
    if not tx_code or len(tx_code) < 6:
        return jsonify(success=False, message='Invalid transaction code'), 400
    # Mark user unlocked (persist in DB)
    return jsonify(success=True, message='Unlocked')

@app.route('/api/paystack-init', methods=['POST'])
def paystack_init():
    data = request.json or {}
    amount = int(data.get('amount', 180) * 100)  # kobo/cent
    email = data.get('email','user@example.com')
    ref = init_paystack_transaction(email, amount)
    if not ref:
        return jsonify(success=False, message='Paystack init failed'), 500
    return jsonify(success=True, authorization_url=ref['authorization_url'], reference=ref['reference'])

@app.route('/webhook/paystack', methods=['POST'])
def paystack_webhook():
    # Verify signature
    secret = os.getenv('PAYSTACK_SECRET_KEY')
    signature = request.headers.get('x-paystack-signature','')
    payload = request.get_data()
    if secret:
        computed = hmac.new(secret.encode(), payload, hashlib.sha512).hexdigest()
        if not hmac.compare_digest(computed, signature):
            abort(400)
    event = request.json or {}
    # Handle events: charge.success etc.
    if event.get('event') == 'charge.success':
        # verify transaction server-side
        ref = event['data']['reference']
        ok = verify_paystack_transaction(ref)
        if ok:
            # credit user, unlock features, etc.
            pass
    return jsonify(status='ok')

@app.route('/api/withdraw', methods=['POST'])
def withdraw():
    data = request.json or {}
    user = data.get('user','Guest')
    amount = float(data.get('amount',0))
    country = data.get('country','KE')
    min_amt = MIN_WITHDRAWAL.get(country, MIN_WITHDRAWAL['KE'])
    if amount < min_amt:
        return jsonify(success=False, message=f'Minimum withdrawal for your country is {min_amt}'), 400
    # In production: create withdrawal job, call payment provider
    return jsonify(success=True, message='Withdrawal request queued')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
