# SurveyPay 100+ Surveys, A-Z World Countries, Cold Boot Fix & Navigation Plan

Implement all requested major updates:
1. Fix the first-install cold boot white/freeze screen bug by adding fail-safe DOM initialization.
2. Expand the country list to all 195+ sovereign world nations sorted strictly A to Z.
3. Add a top-bar **Back Arrow Button** on every sub-screen to easily return to the HOME/Surveys main menu.
4. Expand the survey catalog to **100+ surveys** with short, clean **2-word titles** and clear reward earnings.

## User Review Required

> [!IMPORTANT]
> 1. **First-Install Cold Boot Fix (Zero White Screen)**:
>    - Root cause: On first install without cached external CDNs (Tailwind, FontAwesome, Paystack), JS execution delayed or blocked hiding `#screen-loading` (`z-[200]`), causing a white/frozen screen until app restart.
>    - Solution: Added a 1.5-second fail-safe timer that forcibly hides the splash screen and presents the Terms/Auth modal immediately upon DOM load, guaranteeing instant app launch on first install.
> 2. **Top Header Back Arrow Button**:
>    - Added a `<button onclick="switchMainTab('surveys')"><i class="fa-solid fa-arrow-left text-cyan-400"></i></button>` to the top header on Wallet, Profile, and Help screens so users can tap Back anytime to return to the HOME/Surveys main menu.
> 3. **100+ Surveys with Short 2-Word Titles**:
>    - Built a catalog of **100+ surveys** with concise 2-word names (e.g., *M-Pesa Usage*, *Daily Expenses*, *Youth Jobs*, *Data Networks*, *Social Media*, *Public Transit*, *Food Delivery*, *Mobile Banking*, *Health Insurance*, *Gaming Habits*, *Online Shopping*, *Smart Watches*, *Crypto Assets*, *Solar Power*, *Air Travel*, etc.).
>    - Paginated 5 surveys per page with Previous/Next controls and explicit reward earnings (+650 KES to +1,800 KES).
> 4. **195+ Sovereign World Countries (A to Z)**:
>    - Alphabetically sorted array containing every sovereign country in the world from **Afghanistan** to **Zimbabwe**.

## Proposed Changes

### Web Application (`index.html`, `frontend/index.html`, `android/app/src/main/assets/index.html`)

#### [MODIFY] [index.html](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/index.html)
- Add cold boot fail-safe timer (`setTimeout`) in splash screen JS to ensure `#screen-loading` is hidden instantly.
- Update header with dynamic `<button id="btn-header-back">` showing a Back Arrow when not on the Home tab.
- Populate `COUNTRIES_MAP` with all 195+ world countries alphabetically from A to Z.
- Generate `DEFAULT_SURVEYS` with **100+ surveys** having short 2-word titles, reward values, and icons.
- Update survey pagination to show 5 surveys per page with Previous/Next controls.

### Android Asset Synchronization & Build

#### [COMPILE] [Signed APK Output](file:///C:/Users/EAGLE/Downloads/survy%20pay.apk)
- Sync updated `index.html` to `frontend/index.html` and `android/app/src/main/assets/index.html`.
- Recompile signed release APK to `C:\Users\EAGLE\Downloads\survy pay.apk`.
- Push updated code to GitHub repository `origin/main`.

## Verification Plan

### Automated & Manual Verification
1. Test cold boot / first install initialization to ensure no white screen or freeze occurs.
2. Verify top-bar Back Arrow button appears when navigating to Wallet, Profile, or Help tabs and returns user to HOME.
3. Verify country selector dropdown lists all world countries strictly A to Z.
4. Verify survey list contains 100+ items with short 2-word titles and reward earnings.
5. Recompile, sign, and verify release APK output to `C:\Users\EAGLE\Downloads\survy pay.apk`.
