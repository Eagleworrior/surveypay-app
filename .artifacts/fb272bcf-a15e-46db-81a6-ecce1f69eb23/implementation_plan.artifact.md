# Implementation Plan - Top-Positioned Activation Modal & Real-Time Safaricom STK Push Fix

Fix the M-Pesa STK Push payment flow and reposition the activation modal to the top of the screen:
1. **Explanation of Why STK Push Was Not Received**:
   - Standalone Android WebViews (`file:///android_asset/index.html`) run locally on the phone. Safaricom Daraja STK Push requires a live, publicly accessible backend server (`https://your-backend.com` running `server.js` with your production Daraja keys) so Safaricom's servers can dispatch the STK Push prompt to the user's M-Pesa phone number.
   - Previously, local fallback simulation returned `status: "paid"` automatically, giving a false success. We will **disable automatic simulated payment success** so the app strictly demands a real STK Push response.
2. **Top-Positioned Activation Modal**:
   - Reposition the activation card/modal (`actV()`) to the **top center of the screen** (`fixed top-4 inset-x-0 z-[300]`) so the M-Pesa phone input and Pay button are instantly visible without scrolling.
3. **Live Backend Base URL Configuration**:
   - Add a configurable `API_BASE` variable in `index.html` so the app can connect directly to your live production backend server when deployed.

## User Review Required

> [!IMPORTANT]
> - **Top-Positioned Payment Modal**: The activation payment card will appear right at the top of the screen where users can see it immediately.
> - **No Fake Local Success**: Disables local simulated payment success so accounts are activated ONLY when Safaricom Daraja confirms real M-Pesa payment (`ResultCode = 0`).
> - **Live Server Requirement**: Real M-Pesa STK Push prompts require your backend `server.js` to be hosted on a live public URL (e.g. Render / Railway / VPS with SSL) so Safaricom can send M-Pesa prompts to phones.

## Proposed Changes

### Frontend (`index.html` & `app/src/main/assets/index.html`)
#### [MODIFY] [index.html](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/index.html)
- Reposition `actV()` activation modal container to `top-4` (top of screen).
- Disable automatic `status: "paid"` in `simulateApiLocally()` for activation endpoints; demand real STK Query confirmation.
- Add `API_BASE_URL` configuration for connecting to live backend server.
- Sync `index.html` to `app/src/main/assets/index.html`.

## Verification Plan

### Manual Verification
- Test activation modal positioning in WebView / browser to confirm top placement.
- Verify that activation requires verified Safaricom payment and does not auto-activate.
