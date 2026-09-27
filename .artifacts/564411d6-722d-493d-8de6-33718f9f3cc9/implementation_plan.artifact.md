# SurveyPay Pro App Refactoring & Enhancement Plan

Refactor and enhance the SurveyPay Pro web application to provide a professional, fully featured UI with beautiful colorful decorations, robust registration flow (Name, Email, Country selection with auto-populated country code prefix for phone number, Password, Confirm Password), customized activation payment via Paystack (`pk_live_d3ad28a96d0faa12c3c25a14389d29980a707d3b`), and differentiated payment methods (all payment methods for Kenyan accounts vs card-only for non-Kenyan accounts charging 4 USD / equivalent).

## User Review Required

> [!IMPORTANT]
> - **Paystack Live Key**: Configured with `pk_live_d3ad28a96d0faa12c3c25a14389d29980a707d3b`.
> - **Activation Pricing & Payment Methods**:
>   - **Kenya (KES)**: 200 KES activation fee, all payment methods available (M-Pesa, Card, Bank, etc.).
>   - **Outside Kenya (USD/EUR/GBP/NGN/etc.)**: 4 USD activation fee (or currency equivalent), card payment only.
> - **Registration Requirements**: Full Name, Email, Country Selection, Country Code prefix auto-filling phone number input, Password, and Confirm Password.
> - **UI Styling**: Rich, beautiful, distinct colors for text, headings, input fields (user typing text with custom colors), glassmorphism, and polished navigation menu.

## Proposed Changes

### Frontend Application (`index.html` and `frontend/index.html`)

#### [MODIFY] [index.html](file:///C:/Users/EAGLE/AndroidStudioProjects/surveypay-app/index.html)
- **Registration Form**:
  - Full Name input (with custom colorful text styling).
  - Email input.
  - Country dropdown (with Kenya + multiple international countries like US, UK, Nigeria, Canada, Europe, etc., mapping currencies and country codes).
  - Phone number input preceded by an auto-populated country code label/prefix based on selected country.
  - Password and Confirm Password inputs.
  - Validation: Ensure password matches confirm password, all fields filled, phone number complete.
- **Login / Authentication**:
  - Styled login screen with email/password or username verification.
- **UI & Menu Design**:
  - Decorated with vibrant, distinct colors for titles, subtitles, input text, buttons, and navigation bar (Home, Surveys, Wallet, Profile).
  - Glassmorphic panels, gradient accents.
- **Activation & Paystack Integration**:
  - Live Public Key: `pk_live_d3ad28a96d0faa12c3c25a14389d29980a707d3b`.
  - For Kenya (KES): 200 KES activation, all payment channels enabled.
  - For Outside Kenya: 4 USD equivalent in local currency / USD, restricted to card payment channel (`channels: ['card']`).
  - Clear display of activation fee in user's currency alongside USD equivalent.
- **Surveys & Withdrawal**:
  - Fully working survey completion, earning balance, and withdrawal flows.

## Verification Plan

### Manual Verification
1. Open `index.html` in browser or deploy/test locally.
2. Test registration flow as a Kenyan user (Country: Kenya, currency KES, phone prefix +254): verify activation opens Paystack for 200 KES with all payment methods.
3. Test registration flow as a non-Kenyan user (Country: USA or UK, currency USD/GBP, phone prefix +1/+44): verify activation opens Paystack for 4 USD equivalent with card-only payment channel.
4. Verify all text inputs and UI elements are beautifully styled with distinct colors.
