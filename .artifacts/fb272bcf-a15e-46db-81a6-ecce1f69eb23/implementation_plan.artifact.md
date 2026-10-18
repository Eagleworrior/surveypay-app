# Implementation Plan - Safaricom STK Push Buy Goods Fix & Pre-filled Phone Number Editing

Fix the Safaricom Daraja STK Push error (`"Failed due to an unresolved reason type"`) by setting `TransactionType: "CustomerBuyGoodsOnline"` for Till shortcode `4414485`, and pre-fill the payment modal with the user's registered phone number while allowing editing.

## User Review Required

> [!IMPORTANT]
> - **Why Safaricom Returned `"Failed due to an unresolved reason type"`**:
>   - Shortcode `4414485` is a Safaricom Buy Goods (Till Number).
>   - When `TransactionType: "CustomerPayBillOnline"` was sent to a Till Number, Safaricom's Daraja API rejected the request before prompting the phone.
>   - **The Fix**: We will set `TransactionType: "CustomerBuyGoodsOnline"` for Till shortcode `4414485` (with an automatic fallback to `CustomerPayBillOnline`), ensuring Safaricom accepts the request and **dispatches the STK PIN prompt directly to your phone**.
> - **Pre-filled Registered Phone Number**:
>   - When the user opens the activation modal, the M-Pesa phone number input will automatically pre-fill with the exact phone number they signed up with (e.g. `0746938285`), and the user can freely edit or change it to any phone number they wish to pay with.

## Proposed Changes

### Frontend (`index.html` & `app/src/main/assets/index.html`)
#### [MODIFY] [index.html](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/index.html)
- Update `DARAJA_CONFIG` and `triggerDirectStkPush()` to use `TransactionType: "CustomerBuyGoodsOnline"` for Till shortcode `4414485` with automatic fallback to `CustomerPayBillOnline`.
- Ensure `actV()` pre-fills the phone input with `S.user.phone` while keeping the input fully editable.
- Sync `index.html` to `app/src/main/assets/index.html`.

### Backend Configuration (`.env`, `server.js`)
#### [MODIFY] [.env](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/.env)
- Set `MPESA_TXN_TYPE=CustomerBuyGoodsOnline`.

## Verification Plan

### Manual Verification
- Test STK Push trigger with `CustomerBuyGoodsOnline` to verify Safaricom accepts the request and dispatches the M-Pesa PIN prompt to the phone.
- Verify that the phone number input pre-fills with the user's signup phone number and remains 100% editable.
