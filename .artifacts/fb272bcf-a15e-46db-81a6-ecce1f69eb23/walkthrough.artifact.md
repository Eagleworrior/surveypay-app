# Walkthrough - Safaricom Daraja Store Number (`1074758`) & Till Number (`4414485`) STK Push Mapping

Configured your Store Number (`1074758`) as `BusinessShortCode` and your Till Number (`4414485`) as `PartyB` for Safaricom Lipa Na M-Pesa Buy Goods (`CustomerBuyGoodsOnline`) STK Push.

## Changes Made

### Configuration & Frontend (`.env`, `server.js`, `index.html`)
- **Resolved `"The agent number and store number entered do not match"`**:
  - Configured **`BusinessShortCode: "1074758"`** (Store Number / Head Office Shortcode).
  - Configured **`PartyB: "4414485"`** (Till Number / Destination Shortcode).
  - Calculated Daraja Base64 Password using Store Number **`1074758`**.
  - Set **`TransactionType: "CustomerBuyGoodsOnline"`**.
- **Synced Assets**: Updated `app/src/main/assets/index.html`.

## Verification Results
- Store Number `1074758` and Till Number `4414485` mapping verified.
- Fresh signed release APK exported to `C:\Users\EAGLE\Downloads\SurveyPay-Signed.apk`.
- Changes pushed to GitHub (`Eagleworrior/surveypay-app.git main -> main`).
