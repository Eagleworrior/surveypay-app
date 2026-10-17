# Implementation Plan - Professional Boxed Bottom Nav & Zero-White-Text Neon Styling

Upgrade `index.html` (and sync to Android assets):
1. **Professional Boxed Bottom Navigation**: Style each bottom navigation tab (Earn, Me, Balance, History, Withdraw) inside a sleek, professional neon-bordered card/box container with distinct glowing active states and icons.
2. **Zero White Text (100% Vibrant Neon)**: Set global text color to neon cyan (`#38bdf8`), ensuring every heading, label, paragraph, button, survey question, and answer choice is explicitly colored with rich neon gradients (Cyan, Emerald, Amber, Gold, Purple, Pink).

## User Review Required

> [!IMPORTANT]
> - **Boxed Bottom Navigation**: Each tab at the bottom is styled as a professional glowing card/box rather than plain text.
> - **Zero White Text**: All text across the app is explicitly colored in vibrant neon tones.

## Proposed Changes

### Frontend (`index.html` & `app/src/main/assets/index.html`)
#### [MODIFY] [index.html](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/index.html)
- Update `.nav` and `.nav button` CSS styles to render each navigation tab as a professional glowing box/container with distinct neon borders and icon accents.
- Update global body text color to `#38bdf8` and ensure all templates use explicit neon typography classes (`text-cyan-300`, `text-emerald-300`, `text-amber-300`, `text-purple-300`, `balance-gold`).
- Sync `index.html` to `app/src/main/assets/index.html`.

## Verification Plan

### Manual Verification
- Test app in WebView / browser to confirm professional boxed bottom navigation tabs and 100% vibrant neon colored text.
