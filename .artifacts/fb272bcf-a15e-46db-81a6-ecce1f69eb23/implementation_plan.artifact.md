# Implementation Plan - Final Neon Color Fixes & 3-Survey Activation Rule Confirmation

Confirm the 3-free-surveys activation rule and anti-repeat restriction, and permanently fix the remaining white text on:
1. **Sign Up & Log In Headers / Buttons** in `authV()`.
2. **M-Pesa & Bank Tabs** in `wdV()`.
3. **Surveys & Withdrawals Sub-Tabs** in `histV()`.

## User Review Required

> [!IMPORTANT]
> - **Zero White Text Remaining**: All auth headers, withdrawal M-Pesa/Bank tabs, and history sub-tabs are now explicitly colored in neon tones.
> - **Rules Confirmed**: 3 free surveys max before mandatory 200 KES account activation, with strict anti-repeat protection (no taking the same survey twice).

## Proposed Changes

### Frontend (`index.html` & `app/src/main/assets/index.html`)
#### [MODIFY] [index.html](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/index.html)
- Update `authV()` header/button text colors to vibrant neon cyan/emerald.
- Update `wdV()` M-Pesa and Bank tab text colors to vibrant neon emerald/cyan.
- Update `histV()` Surveys and Withdrawals sub-tab text colors to vibrant neon purple/indigo.
- Confirm and test 3 free surveys rule and anti-repeat check in `simulateApiLocally()`.
- Sync `index.html` to `app/src/main/assets/index.html`.

## Verification Plan

### Manual Verification
- Test auth screen, withdrawal tabs, and history sub-tabs in WebView / browser to confirm zero white text remaining.
