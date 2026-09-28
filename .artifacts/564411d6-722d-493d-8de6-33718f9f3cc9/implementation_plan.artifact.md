# SurveyPay UI Enhancement, Global Countries & Withdrawal Workflows Plan

Refactor SurveyPay web application and Android APK to incorporate user feedback: increased text sizing, vibrant button and balance colors, realistic Market Research Survey categories, dedicated withdrawal input forms per channel, 195+ global country selector, and black-to-green custom terms agreement checkboxes.

## User Review Required

> [!IMPORTANT]
> 1. **Text Sizing**: Increased base text sizes across the app from tiny `text-[10px]` / `text-xs` to comfortable medium sizes (`text-xs`, `text-sm`, `text-base`).
> 2. **Vibrant Text & Balance Colors**:
>    - Total Capital Balance displayed in glowing **Gradient Gold/Emerald** text.
>    - "ACTIVATE ACCOUNT" hero button styled in **Bright Yellow/Gold** text with a glowing border.
> 3. **Market Research Survey Categories**:
>    - Survey titles updated to authentic market research types (e.g., *Consumer Habits Survey*, *FinTech & Digital Banking Survey*, *Streaming & Entertainment Survey*, *Healthcare & Wearables Survey*).
>    - Card action button clearly labeled **LOCKED** (or **START** if activated) with a lock icon instead of "BUY".
> 4. **Detailed Withdrawal Channel Forms**:
>    - **Bank Transfer**: Prompts for Bank Name, Account Holder Name, and Account Number.
>    - **M-Pesa**: Pre-fills the user's registered phone number automatically.
>    - **PayPal**: Asks for PayPal Email Address.
>    - **Crypto**: Asks for USDT Wallet Address (TRC20 / BEP20).
> 5. **Complete 195+ Worldwide Countries**:
>    - Expanded country dropdown with all sovereign nations globally and international dialing codes.
> 6. **Custom Terms Checkboxes**:
>    - Styled with a dark black background (`bg-slate-950 border-slate-700`) that turns bright green with a checkmark when selected.

## Proposed Changes

### Web Application (`index.html`, `frontend/index.html`, `android/app/src/main/assets/index.html`)

#### [MODIFY] [index.html](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/index.html)
- Increase text size classes across inputs, labels, buttons, and badges.
- Expand `COUNTRIES_MAP` to include all world countries (195+ entries).
- Add custom CSS for `.custom-checkbox` (black unselected, bright green with checkmark when selected).
- Update `DEFAULT_SURVEYS` catalog with real Market Research Survey types and "LOCKED" action pills.
- Enhance `handleWithdrawRequest()` to open a modal with specific input fields based on chosen payment channel (Bank Name/Holder/Account for Bank, pre-filled phone for M-Pesa, Email for PayPal, TRC20 address for Crypto).
- Re-style `#disp-balance`, `#wallet-balance-disp`, and `#btn-hero-action` with vibrant gold/yellow colors.

### Android Asset Synchronization & Build

#### [COMPILE] [Signed APK Output](file:///C:/Users/EAGLE/Downloads/survy%20pay.apk)
- Sync updated `index.html` to `frontend/index.html` and `android/app/src/main/assets/index.html`.
- Recompile signed release APK to `C:\Users\EAGLE\Downloads\survy pay.apk`.
- Push updated code to GitHub repository `origin/main`.

## Verification Plan

### Manual Verification
1. Verify terms agreement checkboxes start black and turn green with a tick on click.
2. Verify all text sizes are comfortable medium readability.
3. Test country selector dropdown contains global countries and populates dial code properly.
4. Verify survey task cards display realistic survey titles with "LOCKED" status badges.
5. Test withdrawal channels modal with Bank, M-Pesa, PayPal, and Crypto input fields.
6. Recompile release APK, verify signature, and push to GitHub.
