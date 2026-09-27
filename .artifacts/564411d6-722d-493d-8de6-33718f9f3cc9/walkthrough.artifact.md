# Signed APK Generation - SurveyPay Pro Walkthrough

The production-ready signed Android APK for SurveyPay Pro has been compiled, zipaligned, signed with a release keystore, and placed directly in your Downloads folder.

## Build Details & Output Location

- **File Name**: `survy pay.apk` (and `survy pay`)
- **Primary Destination**: [survy pay.apk](file:///C:/Users/EAGLE/Downloads/survy%20pay.apk)
- **Secondary Destination**: [survy pay](file:///C:/Users/EAGLE/Downloads/survy%20pay)
- **Package Name**: `com.surveypay.app`
- **Application Label**: `SurveyPay Pro`
- **File Size**: ~22.2 MB

## Features Embedded in APK

1. **Native Fullscreen WebView**:
   - Bundles `index.html` locally into Android assets (`file:///android_asset/index.html`).
   - Enabled JavaScript, DOM Storage, and Mixed Content support.
2. **App Icon & Branding**:
   - Integrated custom `app-icon.png` into `mipmap` launcher icon resources (`ic_launcher.png` and `ic_launcher_round.png`).
3. **Paystack Integration & Pricing Rules**:
   - Live Public Key `pk_live_d3ad28a96d0faa12c3c25a14389d29980a707d3b`.
   - Kenyan accounts: **500 KES** activation fee (all payment methods allowed).
   - International accounts: **$4.00 USD** activation fee (card payment only).
   - Surveys locked until account activation.
4. **Registration & Profile Records**:
   - Captures user name, email, country code prefix + phone number, password, and registration date.
   - Displays colorful decorated record cards in the Profile tab.

## Verification
- Verified APK signature using Android SDK `apksigner verify`: `Verification successful`.
- Confirmed file existence in `C:\Users\EAGLE\Downloads\survy pay.apk`.
