# backend/config.py
import os
class Config:
    PAYSTACK_SECRET_KEY = os.getenv('PAYSTACK_SECRET_KEY')
    PAYSTACK_PUBLIC_KEY = os.getenv('PAYSTACK_PUBLIC_KEY')
    PAYBILL_NUMBER = os.getenv('PAYBILL_NUMBER','880100')
