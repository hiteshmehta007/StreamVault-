# Language Selector Documentation

## Overview
The StreamVault platform now supports a comprehensive list of languages including Hindi and many other regional languages from around the world.

## Supported Languages

### Primary Languages
- 🇺🇸 **English** (English)
- 🇮🇳 **Hindi** (हिन्दी)
- 🇪🇸 **Spanish** (Español)
- 🇫🇷 **French** (Français)
- 🇩🇪 **German** (Deutsch)
- 🇮🇹 **Italian** (Italiano)
- 🇵🇹 **Portuguese** (Português)
- 🇷🇺 **Russian** (Русский)
- 🇯🇵 **Japanese** (日本語)
- 🇰🇷 **Korean** (한국어)
- 🇨🇳 **Chinese** (中文)

### Regional Indian Languages
- 🇮🇳 **Hindi** (हिन्दी)
- 🇮🇳 **Tamil** (தமிழ்)
- 🇮🇳 **Telugu** (తెలుగు)
- 🇮🇳 **Marathi** (मराठी)
- 🇮🇳 **Gujarati** (ગુજરાતી)
- 🇮🇳 **Kannada** (ಕನ್ನಡ)
- 🇮🇳 **Malayalam** (മലയാളം)
- 🇮🇳 **Punjabi** (ਪੰਜਾਬੀ)
- 🇮🇳 **Odia** (ଓଡ଼ିଆ)
- 🇮🇳 **Assamese** (অসমীয়া)

### South Asian Languages
- 🇧🇩 **Bengali** (বাংলা)
- 🇵🇰 **Urdu** (اردو)
- 🇳🇵 **Nepali** (नेपाली)
- 🇱🇰 **Sinhala** (සිංහල)

### Southeast Asian Languages
- 🇲🇲 **Myanmar** (မြန်မာ)
- 🇹🇭 **Thai** (ไทย)
- 🇻🇳 **Vietnamese** (Tiếng Việt)
- 🇮🇩 **Indonesian** (Bahasa Indonesia)
- 🇲🇾 **Malay** (Bahasa Melayu)
- 🇵🇭 **Filipino** (Filipino)

### Middle Eastern & African Languages
- 🇸🇦 **Arabic** (العربية)
- 🇰🇪 **Swahili** (Kiswahili)
- 🇪🇹 **Amharic** (አማርኛ)
- 🇳🇬 **Hausa** (Hausa)
- 🇳🇬 **Yoruba** (Yorùbá)
- 🇳🇬 **Igbo** (Igbo)
- 🇿🇦 **Zulu** (isiZulu)
- 🇿🇦 **Afrikaans** (Afrikaans)

### Universal Option
- 🌍 **Other** (Other)

## Usage in Components

### 1. Video Upload Component
When uploading videos, users can select from all supported languages to specify the video's primary language.

### 2. Channel Creation
During channel setup, creators can specify their primary content language from the comprehensive list.

### 3. User Settings
Users can set their preferred interface language in the Settings page under Appearance settings.

### 4. Sidebar Language Selector
Quick language switching is available in the sidebar preferences section.

### 5. Video Player Captions
The video player supports captions in multiple languages (top 10 most commonly used).

## Implementation Details

### LanguageSelector Component
The `LanguageSelector` component supports three variants:
- **Select**: Traditional dropdown select (default)
- **Dropdown**: Button-style dropdown with rich formatting
- **Button**: Icon-only button for compact spaces

### Language Context Provider
The `LanguageProvider` context manages language state across the application:
- Persists language preference in localStorage
- Updates document language attribute
- Provides current language to all components

### Props and Options
- `showFlag`: Display country/region flags (default: true)
- `showNativeName`: Show native script alongside English names
- `size`: Control component size (sm, md, lg)
- `variant`: Choose display style (select, dropdown, button)

## Accessibility Features
- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast flag emojis for visual clarity
- Native language names for better recognition

## Future Enhancements
- Right-to-left (RTL) layout support for Arabic and Urdu
- Dynamic translation system integration
- Regional content preferences
- Language-specific keyboard shortcuts

This comprehensive language support ensures that users from diverse linguistic backgrounds can access and enjoy content on StreamVault in their preferred language.