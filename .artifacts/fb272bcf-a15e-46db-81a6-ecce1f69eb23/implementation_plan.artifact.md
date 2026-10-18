# Implementation Plan - Safaricom Store Number (1074748) & Till Number (4414485) STK Push Mapping

Map your Store Number (`1074748`) as the `BusinessShortCode` and your Till Number (`4414485`) as `PartyB` for Safaricom Daraja Lipa Na M-Pesa Buy Goods (`CustomerBuyGoodsOnline`) STK Push.

## User Review Required

> [!IMPORTANT]
> - **Why `"The agent number and store number entered do not match"` Happened**:
>   - When using Safaricom Buy Goods (Till) with Daraja API, Safaricom assigns a **Store Number** (`1074748`) and a **Till Number** (`4414485`).
>   - For `CustomerBuyGoodsOnline` STK Push, Safaricom Daraja requires:
>     - `BusinessShortCode` = Store Number = **`"1074748"`**
>     - `PartyB` = Till Number = **`"4414485"`**
>     - `Password` = Base64(`"1074748"` + Passkey + Timestamp)
>   - Previously, `4414485` was sent as the `BusinessShortCode`, causing Safaricom to reject the request because the Store Number was missing.
> - **The Fix**: We will set `BusinessShortCode: "1074748"` and `PartyB: "4414485"`. This matches Safaricom's exact Store-to-Till mapping, eliminating the error and **dispatching the real STK PIN prompt directly to your phone**.

## Proposed Changes

### Frontend (`index.html` & `app/src/main/assets/index.html`)
#### [MODIFY] [index.html](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/index.html)
- Update `DARAJA_CONFIG` to store `storeNumber: "1074748"` and `tillNumber: "4414485"`.
- Update `triggerDirectStkPush()` and `queryDirectStkStatus()` to use `storeNumber` for `BusinessShortCode` and `Password`, and `tillNumber` for `PartyB`.
- Sync `index.html` to `app/src/main/assets/index.html`.

### Backend & Configuration (`.env`, `server.js`)
#### [MODIFY] [.env](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/.env)
- Set `MPESA_SHORTCODE=1074748` (Store Number).
- Set `MPESA_PARTYB=4414485` (Till Number).
- Set `MPESA_TXN_TYPE=CustomerBuyGoodsOnline`.

#### [MODIFY] [server.js](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/server.js)
- Update STK Push request body to pass `1074748` as `BusinessShortCode` and `4414485` as `PartyB`.

## Verification Plan

### Manual Verification
- Test triggering STK Push with Store Number `1074748` and Till Number `4414485` to verify Safaricom accepts the Buy Goods request and dispatches the M-Pesa PIN prompt directly to your phone.
