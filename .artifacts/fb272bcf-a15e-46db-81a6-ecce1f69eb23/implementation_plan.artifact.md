# Implementation Plan - Generate Signed Release APK

Create a dedicated release keystore (`surveypay-release.jks`), configure signing configs in `build.gradle.kts`, build the signed release APK, and export only the signed APK (`SurveyPay-Signed.apk`) to the user's Downloads folder while removing unsigned artifacts.

## Proposed Changes

### Android Build & Signing Configuration
#### [MODIFY] [build.gradle.kts](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/android/app/build.gradle.kts)
- Add `signingConfigs` block with release keystore properties.
- Configure `release` build type to use `signingConfigs.getByName("release")`.

#### [NEW] Release Keystore (`android/app/surveypay-release.jks`)
- Generate using `keytool`.

## Verification Plan

### Automated Build & Export
- Run `./gradlew.bat assembleRelease` with JAVA_HOME and ANDROID_HOME.
- Verify output signed APK exists at `android/app/build/outputs/apk/release/app-release.apk`.
- Copy to `C:\Users\EAGLE\Downloads\SurveyPay-Signed.apk` and clean up unsigned APKs.
