# Implementation Plan - Direct Safaricom Daraja STK Push Delivery & Universal File Access Fix

Enable universal cross-origin access in Android WebView (`MainActivity.java`) and wire direct Safaricom Daraja M-Pesa STK Push API calls in `index.html` using production credentials (`4414485`, Key, Secret, Passkey) so the physical phone receives the real M-Pesa PIN prompt instantly.

## User Review Required

> [!IMPORTANT]
> - **WebView Universal File Access Enabled**: In `MainActivity.java`, `settings.setAllowUniversalAccessFromFileURLs(true)` and `settings.setAllowFileAccessFromFileURLs(true)` are enabled so the Android app can issue direct HTTPS requests to Safaricom's production servers (`https://api.safaricom.co.ke`) without CORS restrictions.
> - **Direct STK Push Dispatch**: When the user taps Pay, the app contacts Safaricom Daraja directly, generating the live OAuth2 token and dispatching the real M-Pesa STK Push PIN prompt to the user's phone number (`2547XXXXXXXX`).
> - **Real-Time Safaricom Polling**: The app polls `https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query` in real time, displaying exact feedback (Wrong PIN `2001`, Insufficient Balance `1`, Canceled `1032`) or the **Green Tick (`✓`) Payment Successful** confirmation modal upon `ResultCode = 0`.

## Proposed Changes

### Android Java (`MainActivity.java`)
#### [MODIFY] [MainActivity.java](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/app/src/main/java/com/surveypay/app/MainActivity.java)
- Enable `settings.setAllowUniversalAccessFromFileURLs(true)` and `settings.setAllowFileAccessFromFileURLs(true)` to permit direct HTTPS requests from `file:///android_asset/index.html` to Safaricom Daraja servers.

### Frontend (`index.html` & `app/src/main/assets/index.html`)
#### [MODIFY] [index.html](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/index.html)
- Execute direct Safaricom OAuth2 token generation and direct STK Push dispatch (`/mpesa/stkpush/v1/processrequest`) with production credentials (`4414485`, Key, Secret, Passkey).
- Poll `https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query` every 3 seconds for real-time result code verification.
- Render Green Tick (`✓`) Payment Successful modal upon confirmed payment.
- Sync `index.html` to `app/src/main/assets/index.html`.

## Verification Plan

### Manual Verification
- Test STK Push dispatch in WebView / browser to confirm direct Safaricom Daraja communication without CORS errors.
