import os
from dotenv import load_dotenv

load_dotenv() # Loads variables from .env file

class Config:
    PAYSTACK_SECRET_KEY = os.getenv('PAYSTACK_SECRET_KEY')
    PAYSTACK_PUBLIC_KEY = os.getenv('PAYSTACK_PUBLIC_KEY')
    PAYBILL_NUMBER = os.getenv('PAYBILL_NUMBER', '880100')
