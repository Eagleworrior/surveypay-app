# SurveyPay App Layout Optimization, Rebranding & Bottom Navigation Matching Screenshot

Refactor SurveyPay to match the exact design style from the user's screenshot (`WhatsApp Image 2026-09-28 at 07.42.49.jpeg`), featuring 3D colorful bottom navigation menu icons, a blue gradient hero card, left-accented survey cards, zero-scroll 2-step registration wizard, paginated surveys, rebranding from **SurveyPay Pro** to **SurveyPay**, and signed Android APK generation.

## User Review Required

> [!IMPORTANT]
> - **Bottom Navigation Menu Design (Matched to Screenshot)**:
>   - **HOME**: House icon with orange/red roof (`<i class="fa-solid fa-house"></i>` with 3D gradient/colors).
>   - **SURVEYS**: Gift box icon with gold ribbon (`<i class="fa-solid fa-gift"></i>`).
>   - **WALLET**: Briefcase icon (`<i class="fa-solid fa-briefcase"></i>`).
>   - **PROFILE / ME**: User silhouette icon (`<i class="fa-solid fa-user-large"></i>`).
>   - Active tab highlighted in bright cyan with bold uppercase labels (`HOME`, `SURVEYS`, `WALLET`, `ME`).
> - **Card & UI Styling (Matched to Screenshot)**:
>   - **Hero Balance Card**: Rich blue gradient (`bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700`) with white balance text and prominent activation button.
>   - **Survey Task Cards**: Dark rounded cards with a cyan left border accent (`border-l-4 border-cyan-400`), cyan title, green reward text, and cyan pill action buttons.
> - **Rebranding**: Changed all occurrences of **SurveyPay Pro** to **SurveyPay**.
> - **2-Step Registration Wizard (Zero Scrolling)**:
>   - **Step 1**: Name, Email, Country Selection, and Phone Number (*Next*).
>   - **Step 2**: Password and Confirm Password (*Create Account*).
> - **Compact Paginated Surveys**: Shows 3 surveys per page with Previous/Next controls.
> - **Android Signed APK**: Recompile and sign release APK `survy pay.apk` directly to `C:\Users\EAGLE\Downloads\survy pay.apk`.

## Proposed Changes

### Web Application (`index.html` & `frontend/index.html`)

#### [MODIFY] [index.html](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/index.html)
- Rebrand to `SurveyPay`.
- Style bottom navigation menu to match the screenshot (`HOME`, `SURVEYS`, `WALLET`, `ME`) with 3D colorful icons and glowing active cyan text.
- Re-style Hero Balance card with blue gradient and rounded corners matching screenshot.
- Re-style Survey cards with cyan left-border accent (`border-l-4 border-cyan-400`), green earnings rate, and rounded cyan buttons.
- Implement 2-step registration wizard for `form-register`.
- Implement 3-survey pagination (`prevSurveyPage()`, `nextSurveyPage()`).

### Android Gradle Project (`android/`)

#### [MODIFY] [strings.xml](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/android/app/src/main/res/values/strings.xml) & [AndroidManifest.xml](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/android/app/src/main/AndroidManifest.xml)
- Update `app_name` string resource and manifest label to `SurveyPay`.

#### [COMPILE] [Signed APK Output](file:///C:/Users/EAGLE/Downloads/survy%20pay.apk)
- Recompile with Gradle (`./gradlew assembleRelease`).
- Sign with release keystore and output `survy pay.apk` to `C:\Users\EAGLE\Downloads\survy pay.apk`.

## Verification Plan

### Manual & Automated Build Verification
1. Verify bottom navigation menu styling against the user's screenshot.
2. Verify 2-step registration wizard fits on single mobile screen height.
3. Test survey pagination (Previous/Next controls).
4. Recompile, sign, and verify release APK output to `C:\Users\EAGLE\Downloads\survy pay.apk`.
5. Commit and push updated files to remote git repository.
