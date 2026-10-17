# Implementation Plan - Comprehensive Audit & Fix of All App Features

Perform a thorough audit and refactoring of `index.html` (and sync to Android assets) to guarantee that **every single feature and fix requested by the user is fully intact, bug-free, and never reverted**:
1. **Separated Auth Forms**: Sign Up requires Full Name, Email, Phone, Password, and Confirm Password (5 fields). Login requires Email and Password only.
2. **Zero White Text Neon Styling**: Every text element, header, title, description, label, form field, button, survey question, option, and bottom nav label is explicitly styled with vibrant neon colors (Cyan, Emerald, Amber, Gold, Purple, Rose/Pink) with zero plain white text.
3. **Professional Boxed Bottom Navigation**: Bottom nav bar remains permanently visible across all tabs (Earn, Me, Balance, History, Withdraw) inside professional glowing card boxes.
4. **50 Unique Questions & 3-Free-Surveys Lock**: 12 surveys with 50 unique questions each. After 3 free completions, remaining surveys lock automatically and prompt for the 200 KES account activation via real-time Safaricom STK Push.
5. **Withdrawal Balance Deduction**: Successful withdrawals deduct the exact amount from the user's available balance instantly.
6. **Synchronous History & Balance**: History and Balance views update and render instantly without hanging.

## User Review Required

> [!IMPORTANT]
> - **Comprehensive Verification**: All fixes are unified and verified together to ensure nothing is reverted or left broken.

## Proposed Changes

### Frontend (`index.html` & `app/src/main/assets/index.html`)
#### [MODIFY] [index.html](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/index.html)
- Audit and consolidate all HTML views (`authV`, `profileV`, `earnV`, `runV`, `actV`, `balV`, `histV`, `wdV`) to ensure 100% neon colored text and correct field bindings.
- Ensure bottom nav is always rendered permanently in `draw()`.
- Sync `index.html` to `app/src/main/assets/index.html`.

## Verification Plan

### Manual Verification
- Test all user flows in WebView / browser to confirm auth forms, zero white text, boxed bottom nav, survey locking, STK push, and withdrawal balance deductions.
