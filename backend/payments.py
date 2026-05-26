# backend/payments.py
import os
import requests
import logging

# Configure logging for production debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PAYSTACK_SECRET = os.getenv('PAYSTACK_SECRET_KEY')
PAYSTACK_BASE = 'https://api.paystack.co'

def init_paystack_transaction(email, amount_kobo):
    """Initializes a transaction. Amount must be in kobo/cents."""
    url = f'{PAYSTACK_BASE}/transaction/initialize'
    headers = {
        'Authorization': f'Bearer {PAYSTACK_SECRET}',
        'Content-Type': 'application/json'
    }
    data = {
        'email': email, 
        'amount': int(amount_kobo), 
        'currency': 'KES'
    }
    
    try:
        r = requests.post(url, json=data, headers=headers, timeout=10)
        if r.status_code == 200:
            return r.json().get('data')
        logger.error(f"Paystack Init Failed: {r.text}")
    except Exception as e:
        logger.error(f"Paystack Network Error: {e}")
    return None

def verify_paystack_transaction(reference):
    """Verifies a transaction using its reference string."""
    url = f'{PAYSTACK_BASE}/transaction/verify/{reference}'
    headers = {'Authorization': f'Bearer {PAYSTACK_SECRET}'}
    
    try:
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code == 200:
            data = r.json().get('data', {})
            return data.get('status') == 'success'
    except Exception as e:
        logger.error(f"Verification Error: {e}")
    return False
