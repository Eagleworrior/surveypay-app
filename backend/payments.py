import requests
from config import Config

PAYSTACK_BASE = 'https://api.paystack.co'

def init_paystack_transaction(email, amount_kobo):
    url = f'{PAYSTACK_BASE}/transaction/initialize'
    headers = {'Authorization': f'Bearer {Config.PAYSTACK_SECRET_KEY}'}
    data = {'email': email, 'amount': int(amount_kobo), 'currency': 'KES'}
    
    r = requests.post(url, json=data, headers=headers, timeout=10)
    return r.json().get('data') if r.status_code == 200 else None

def verify_paystack_transaction(reference):
    url = f'{PAYSTACK_BASE}/transaction/verify/{reference}'
    headers = {'Authorization': f'Bearer {Config.PAYSTACK_SECRET_KEY}'}
    
    r = requests.get(url, headers=headers, timeout=10)
    if r.status_code == 200:
        data = r.json().get('data', {})
        return data.get('status') == 'success'
    return False
