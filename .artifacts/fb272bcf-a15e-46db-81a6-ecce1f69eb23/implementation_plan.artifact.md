# Implementation Plan - Production Safaricom Daraja M-Pesa Credentials & Real-Time Green Tick Activation

Configure live production Safaricom Daraja M-Pesa credentials in `.env` and `server.js`, and enhance real-time STK Query API polling to render a **Green Tick (`✓`) Payment Successful** confirmation modal upon verified payment, while catching exact Safaricom error codes (Wrong PIN, Insufficient Balance, Canceled).

## User Review Required

> [!IMPORTANT]
> - **Production Daraja M-Pesa Credentials Configured**:
>   - **Key**: `GAbKWM1S2Gmk3GuReoUoC52bVzBOXrIDyqzjiZbBYAJiyILs`
>   - **Secret**: `jdv9jcXAD1PNenMXbHGhcPu3VXE4BKkNT9BqP72xxGlXsxY9t0hFlwb0AHjjPGO9`
>   - **Shortcode**: `4414485`
>   - **Passkey**: `d9a0e9a3d9e61eeb50f1e258c9ba8a8679001f1c97bb30be7d709b1a56c25f5d`
> - **Green Tick Success Modal**: Displays a prominent **Green Tick (`✓`)** with *"Payment Successful! Your account is activated and all surveys & withdrawals are unlocked!"* upon confirmed `ResultCode = 0`.
> - **Real-Time Safaricom Feedback**:
>   - **Wrong PIN (ResultCode 2001)**: *"❌ Payment Failed: Wrong M-Pesa PIN entered."*
>   - **Insufficient Balance (ResultCode 1)**: *"❌ Payment Failed: Insufficient M-Pesa balance."*
>   - **Canceled (ResultCode 1032)**: *"❌ Payment Failed: Transaction canceled by user."*
>   - Account remains locked unless payment is 100% verified by Safaricom.

## Proposed Changes

### Server & Configuration (`.env`, `server.js`)
#### [MODIFY] [.env](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/.env)
- Set production Daraja credentials (`MPESA_KEY`, `MPESA_SECRET`, `MPESA_SHORTCODE`, `MPESA_PASSKEY`, `MPESA_PARTYB`).

#### [MODIFY] [server.js](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/server.js)
- Enhance `/api/activate/status/:checkoutId` STK Query API result mapping to return specific Safaricom error messages for Wrong PIN (`2001`), Insufficient Balance (`1`), and Canceled (`1032`).

### Frontend (`index.html` & `app/src/main/assets/index.html`)
#### [MODIFY] [index.html](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/index.html)
- Update `payWithSafaricom()` to remain on the active prompt modal until Safaricom returns a definitive status.
- Show **Green Tick (`✓`) Payment Successful** modal when activation completes.
- Sync `index.html` to `app/src/main/assets/index.html`.

## Verification Plan

### Manual Verification
- Test activation modal, STK Query real-time response handling, Green Tick modal display, and unlocked surveys feed.
