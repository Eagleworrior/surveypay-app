# Signed APK Generation Plan for SurveyPay Pro

Create a native Android WebView wrapper project for SurveyPay Pro, configure Android Gradle build settings, compile and sign the release APK, and place the final signed APK named `survy pay.apk` directly into `C:\Users\EAGLE\Downloads\survy pay.apk`.

## User Review Required

> [!IMPORTANT]
> - **Target Output**: `C:\Users\EAGLE\Downloads\survy pay.apk`
> - **App Name**: `SurveyPay Pro` (Output file: `survy pay.apk`)
> - **App Icon**: `app-icon.png` (Integrated into Android app launch icons)
> - **WebView Features**: JavaScript enabled, DOM Storage enabled, Mixed Content Allowed, Fullscreen/Responsive web view loading local web assets.
> - **Environment Tools**: Java JDK (`C:\Program Files\Android\Android Studio\jbr`) & Android SDK (`C:\Users\EAGLE\AppData\Local\Android\Sdk`).

## Proposed Changes

### Android Project Setup (`android/` or wrapper structure)

#### [NEW] [AndroidManifest.xml](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/android/app/src/main/AndroidManifest.xml)
- Configure Internet permissions (`android.permission.INTERNET`, `android.permission.ACCESS_NETWORK_STATE`).
- Set MainActivity with Fullscreen theme and launcher icon.

#### [NEW] [MainActivity.java](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/android/app/src/main/java/com/surveypay/app/MainActivity.java)
- Android Activity containing a full-screen `WebView`.
- Configure `WebSettings`: `setJavaScriptEnabled(true)`, `setDomStorageEnabled(true)`, `setAllowFileAccess(true)`.
- Load local web assets from `file:///android_asset/index.html`.

#### [NEW] [Assets & Resources](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/android/app/src/main/assets)
- Bundle `index.html` and `app-icon.png` into Android `assets/` and `res/mipmap` drawables.

#### [NEW] [Build & Signing Scripts](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/android/build.gradle.kts)
- Android Gradle project configuration.
- Sign APK with release keystore and output `survy pay.apk` to `C:\Users\EAGLE\Downloads\survy pay.apk`.

## Verification Plan

### Automated Build & Deployment
1. Compile release APK using Gradle wrapper / Android SDK build tools.
2. Verify signed APK generation and copy to `C:\Users\EAGLE\Downloads\survy pay.apk`.
3. Confirm APK file exists, is valid, signed, and ready for device installation.
