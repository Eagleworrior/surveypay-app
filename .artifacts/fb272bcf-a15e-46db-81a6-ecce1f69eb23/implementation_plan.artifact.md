# Implementation Plan - Launcher Icon Overhaul & Standalone Pure CSS Styling

Fix the Android launcher icon on API 26+ devices and restore full, vibrant neon CSS styling without external Tailwind dependencies.

## User Review Required

> [!IMPORTANT]
> - **Launcher Icon Fix**: `mipmap-anydpi-v26/ic_launcher.xml` was pointing to the old default Android foreground icon (`@drawable/ic_launcher_foreground`). We will update `@drawable/ic_launcher_foreground.png` and all mipmap directories with the new Gemini icon and remove duplicate icon files.
> - **Standalone Pure CSS Utility Engine**: Provide full embedded CSS definitions for all layout utilities (`.flex`, `.space-y-3`, `.p-3`, `.rounded-xl`, `.bg-slate-900`, `.border`, `.text-xs`, `.font-black`, `.uppercase`, etc.) so the app renders with 100% full styling and vibrant neon colors completely offline with **zero white text**.

## Proposed Changes

### Android Resources (`app/src/main/res/`)
#### [MODIFY] Foreground and Mipmap Launcher Icons
- Update `@drawable/ic_launcher_foreground.png` with the new Gemini PNG icon.
- Remove duplicate icon files in `res/drawable/app-icon.png`.
- Update all `mipmap-*/ic_launcher.png` and `mipmap-*/ic_launcher_round.png` with the Gemini icon.

### Frontend (`index.html` & `app/src/main/assets/index.html`)
#### [MODIFY] [index.html](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/index.html)
- Add complete pure CSS rules for all utility classes (`.flex`, `.space-y-3`, `.p-3`, `.bg-slate-900`, `.rounded-xl`, `.border`, `.text-xs`, `.font-black`, `.text-cyan-300`, `.text-emerald-300`, `.text-amber-300`, `.text-purple-300`, `.text-orange-300`, `.text-pink-300`, `.text-rose-300`, `.btn-action`, `.input-field`, etc.).
- Ensure every single text element, header, title, and button renders in vibrant neon colors with zero white text.
- Sync `index.html` to `app/src/main/assets/index.html`.

## Verification Plan

### Manual Verification
- Verify that `mipmap-*/` and `drawable/ic_launcher_foreground.png` contain the Gemini icon.
- Test `index.html` rendering to verify full standalone CSS layout and zero white text.
