# Walkthrough - Safaricom Lipa Na M-Pesa Buy Goods (`CustomerBuyGoodsOnline`) Fix & Pre-filled Editable Phone Number

Fixed the Safaricom Daraja STK Push error (`"Failed due to an unresolved reason type"`) by setting `TransactionType: "CustomerBuyGoodsOnline"` for Till shortcode `4414485`, and pre-filled the payment modal input with the user's registered phone number while keeping it 100% editable.

## Changes Made

### Frontend (`index.html` & `app/src/main/assets/index.html`)
- **Fixed Safaricom STK Push Transaction Type (`triggerDirectStkPush()`)**:
  - Shortcode `4414485` is a Safaricom **Lipa Na M-Pesa Buy Goods Till Number**.
  - Updated `triggerDirectStkPush()` to send **`TransactionType: "CustomerBuyGoodsOnline"`** first (with an automatic fallback to `CustomerPayBillOnline` if needed). This eliminates Safaricom's `"Failed due to an unresolved reason type"` error, ensuring Safaricom accepts the request and **dispatches the real STK Push PIN prompt straight to the phone**.
- **Pre-filled & Editable Registered Phone Number (`actV()`)**:
  - Formatted the input value to automatically pre-fill with the user's signup phone number (e.g. `0746938285`).
  - Users can freely edit or type any phone number they wish to pay with.
- **Synced Assets**: Updated `app/src/main/assets/index.html`.

### Configuration & Server (`.env`, `server.js`)
- Set `MPESA_TXN_TYPE=CustomerBuyGoodsOnline` in `.env` and `server.js`.

## Verification Results
- `CustomerBuyGoodsOnline` STK Push transaction type for Till shortcode `4414485` verified.
- Pre-filled editable phone number input verified.
- Fresh signed release APK exported to `C:\Users\EAGLE\Downloads\SurveyPay-Signed.apk`.
