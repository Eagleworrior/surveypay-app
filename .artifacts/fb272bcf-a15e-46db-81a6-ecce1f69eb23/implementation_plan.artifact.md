# Implementation Plan - Multi-Colored Neon Theme & Custom Bottom Nav Icons

Upgrade `index.html` (and sync to Android assets) to incorporate distinct multi-colored neon palettes across every component, button, tab, question, and bottom navigation icon:
1. **Auth Tab Buttons**: Sign Up (Cyan glow) & Log In (Emerald glow) colored text and backgrounds.
2. **Survey Questions & Answers**: Rich colored text (Cyan questions, emerald/purple/amber options).
3. **Withdrawal M-Pesa / Bank Tabs**: Neon emerald and cyan colored buttons.
4. **History Surveys / Withdrawals Tabs**: Neon purple and gold colored buttons.
5. **Bottom Navigation Icons & Text**: Give each bottom nav item its own vibrant unique neon color:
   - 📋 **Earn**: Emerald (`#34d399`)
   - 👤 **Me**: Cyan (`#38bdf8`)
   - 💰 **Balance**: Amber (`#fbbf24`)
   - 🕘 **History**: Purple (`#c084fc`)
   - 🏦 **Withdraw**: Rose/Pink (`#fb7185`)

## User Review Required

> [!IMPORTANT]
> - **Multi-Colored Neon Palette**: Every section uses a vibrant mix of colors (Cyan, Emerald, Amber, Purple, Rose, Pink, Gold) with zero plain white text.
> - **Colored Bottom Nav Icons**: Each bottom navigation tab has its own distinct glowing color and icon.

## Proposed Changes

### Frontend (`index.html` & `app/src/main/assets/index.html`)
#### [MODIFY] [index.html](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/index.html)
- Update auth tab buttons, survey questions/options, withdrawal M-Pesa/Bank tabs, and history sub-tabs with distinct multi-colored neon styles.
- Update bottom navigation markup in `draw()` so every tab has its own dedicated vibrant color and icon.
- Sync `index.html` to `app/src/main/assets/index.html`.

## Verification Plan

### Manual Verification
- Test all screens in WebView / browser to confirm multi-colored neon styling across auth buttons, survey questions, withdrawal tabs, history tabs, and bottom nav icons.
