# backend/payments.py
import os, requests

PAYSTACK_SECRET = os.getenv('PAYSTACK_SECRET_KEY')  # set in env
PAYSTACK_PUBLIC = os.getenv('PAYSTACK_PUBLIC_KEY')

PAYSTACK_BASE = 'https://api.paystack.co'

def init_paystack_transaction(email, amount_kobo):
    url = f'{PAYSTACK_BASE}/transaction/initialize'
    headers = {'Authorization': f'Bearer {PAYSTACK_SECRET}'}
    data = {'email': email, 'amount': amount_kobo}
    r = requests.post(url, json=data, headers=headers, timeout=10)
    if r.status_code == 200:
        return r.json().get('data')
    return None

def verify_paystack_transaction(reference):
    url = f'{PAYSTACK_BASE}/transaction/verify/{reference}'
    headers = {'Authorization': f'Bearer {PAYSTACK_SECRET}'}
    r = requests.get(url, headers=headers, timeout=10)
    if r.status_code == 200:
        data = r.json().get('data', {})
        return data.get('status') == 'success'
    return False
