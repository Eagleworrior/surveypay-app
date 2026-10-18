# Implementation Plan - Fixed Top Popup Modal & Server-Side Daraja CORS Fix

Fix the "Safaricom Error: Failed to fetch" browser CORS restriction and convert the activation payment card into a fixed top-screen popup modal:

## User Review Required

> [!IMPORTANT]
> - **Why "Failed to fetch" Happened in Browser/WebView**: Web browsers and Android WebViews block client-side JavaScript from calling `https://api.safaricom.co.ke` directly due to CORS (Cross-Origin Resource Sharing) security policies.
> - **The Official Server-Side Solution**: The app calls `/api/activate` on your Node.js backend (`server.js`), which executes the Safaricom Daraja STK Push server-to-server with your production credentials (`4414485`, Key, Secret, Passkey) with zero CORS restrictions!
> - **Top Fixed Popup Modal**: `actV()` will be converted into a fixed top-viewport overlay popup (`fixed inset-0 z-[500] flex items-start justify-center pt-6 bg-slate-950/90 backdrop-blur-md`). When triggered, it immediately covers the top of the screen over any survey list without needing any scrolling!

## Proposed Changes

### Server (`server.js`)
#### [MODIFY] [server.js](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/server.js)
- Ensure Node.js server executes `/api/activate` and `/api/activate/status/:checkoutId` via Daraja production API with server-side fetch (zero CORS issues).

### Frontend (`index.html` & `app/src/main/assets/index.html`)
#### [MODIFY] [index.html](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/index.html)
- Route activation requests via `/api/activate` and `/api/activate/status/:checkoutId`.
- Update `actV()` modal styling to `fixed inset-0 z-[500] flex items-start justify-center pt-6 bg-slate-950/90 backdrop-blur-md` so it immediately pops up at the very top of the screen.
- Sync `index.html` to `app/src/main/assets/index.html`.

## Verification Plan

### Manual Verification
- Test triggering activation modal in WebView/browser to verify it pops up immediately at the top of the viewport.
- Test M-Pesa STK Push API flow to confirm server-side Daraja execution with zero CORS errors.
