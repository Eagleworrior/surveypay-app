from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from payments import init_paystack_transaction, verify_paystack_transaction

app = Flask(__name__, static_folder='../frontend', static_url_path='/')
app.config.from_object(Config)
CORS(app)

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/config', methods=['GET'])
def get_config():
    return jsonify({
        "paystackPublicKey": app.config['PAYSTACK_PUBLIC_KEY'],
        "paybillNumber": app.config['PAYBILL_NUMBER']
    })

@app.route('/api/paystack-init', methods=['POST'])
def paystack_init():
    data = request.json
    # Convert KES input to kobo (e.g., 180 -> 18000)
    ref = init_paystack_transaction(data.get('email'), float(data.get('amount')) * 100)
    if ref:
        return jsonify(success=True, authorization_url=ref['authorization_url'])
    return jsonify(success=False), 500

@app.route('/api/withdraw', methods=['POST'])
def withdraw():
    # Logic for handling withdrawals
    return jsonify(success=True, message="Withdrawal request queued")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
