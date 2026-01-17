# Zoho Email Signature Generator

A professional, minimal email signature generator for Zoho employees. Create beautiful, email-compatible HTML signatures with live preview, multiple styles, and easy import instructions.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-Internal-green.svg)

## ✨ Features

### Core Functionality
- **Live Preview**: Real-time updates as you type with instant feedback
- **4 Signature Styles**: Classic, Compact, Modern, and Minimal layouts
- **iOS-Style Toggle Switches**: Professional UI for including/excluding optional fields
- **One-Click Copy**: Copy HTML signature to clipboard with proper formatting
- **Import Instructions**: Detailed step-by-step guides for Zoho Mail, Gmail, macOS Mail, iOS Mail, and Outlook
- **Light/Dark Mode Preview**: Test your signature in both themes before copying

### Form Fields
- **Name** (required) - Your full name
- **Job Title** (optional, toggleable) - Your position at Zoho
- **Department** (optional, toggleable) - Your team or department
- **Email Address** (optional, toggleable) - Your work email
- **Phone Number** (optional, toggleable) - Your contact number
- **LinkedIn Profile** (optional, toggleable) - Your LinkedIn URL
- **Twitter/X Handle** (optional, toggleable) - Your Twitter/X handle
- **Company Website** (optional, toggleable) - Defaults to zoho.com

### Zoho Social Media Integration
- **Official Social Handles**: Include Zoho's official social media links
- **Granular Control**: Toggle individual channels (Twitter/X, LinkedIn, Facebook, Instagram)
- **Display Options**: Choose between text links or icon display
- **Smart Preview**: Social section only appears when enabled

### Technical Highlights
- **Zero Dependencies**: Pure vanilla HTML, CSS, and JavaScript
- **Email Compatible**: Table-based layouts with inline styles for maximum compatibility
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Accessibility**: Keyboard navigation, ARIA labels, and screen reader support
- **Privacy-First**: All processing happens locally in your browser
- **Theme Persistence**: Remembers your dark mode preference

## 🚀 Quick Start

### Option 1: Open Locally
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Fill in your information (only Name is required)
4. Toggle fields on/off using the switches
5. Choose your preferred signature style
6. Click "Copy Signature" to copy the HTML
7. Click "How to Import?" for detailed email client instructions

### Option 2: Run with Local Server
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## 📦 What's Included

```
signature-generator/
├── index.html              # Main application structure
├── css/
│   └── styles.css         # Complete styling with Zoho branding
├── js/
│   ├── app.js             # Form handling, state management, toggles
│   ├── signature.js       # 4 signature style generators
│   └── modal.js           # Modal functionality with accessibility
├── toggle-demo.html       # UI comparison demo (not part of app)
├── README.md              # This file
└── .gitignore             # Git ignore rules
```

## 🎨 Signature Styles

### 1. Classic
Traditional layout with logo on top. Clean and professional with vertical stacking.

### 2. Compact
Minimal design with everything in one line. Perfect for email clients with limited space.

### 3. Modern
Logo on the left with a vertical red line separator. Contemporary and eye-catching.

### 4. Minimal
Clean text-only design without logo. Name appears in Zoho red for brand recognition.

## 🌐 Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge (Chromium) 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📧 Email Client Compatibility

The generated signatures use table-based layouts with inline styles for maximum compatibility.

### Fully Compatible
- Gmail (Web, iOS, Android)
- Apple Mail (macOS, iOS, iPadOS)
- Outlook (Windows, macOS, Web, iOS, Android)
- Zoho Mail
- Yahoo Mail
- ProtonMail
- Thunderbird

### Known Limitations
- Some email clients may strip custom fonts (fallback to Arial/Helvetica/sans-serif)
- Image loading depends on client settings and internet connectivity
- Colors and layout are preserved in all tested clients

## ⌨️ Keyboard Shortcuts

- `Cmd/Ctrl + K` - Focus on name input field
- `Tab` - Navigate between form fields
- `Escape` - Close modal window
- `Enter` - Toggle switches and buttons

## 🎯 How It Works

### State Management
The application uses a centralized `AppState` object to manage:
- Form data values
- Field toggle states (on/off for each optional field)
- Selected signature style
- Social media options (enabled channels, display type)
- Theme preference (light/dark mode)

### Toggle Switches
iOS-style toggle switches provide a clean, modern interface:
- **Active state**: Red background (#E42527) with knob slid right
- **Inactive state**: Gray background (#e0e0e0) with knob on left
- **Smooth transitions**: 0.3s ease animation for professional feel
- **Automatic field control**: Toggles enable/disable corresponding input fields

### Signature Generation
Four separate generator methods create email-compatible HTML:
- Uses HTML tables for layout (better email client support than flexbox/grid)
- All styles are inline (required for most email clients)
- Logo loads from Zoho's CDN (https://www.zoho.com/sites/zweb/images/zoho_general_pages/zoho-logo-512.png)
- Contact details are properly escaped and validated
- Social links only appear when explicitly enabled

## 🛠️ Customization

### Changing Colors

Edit CSS custom properties in `css/styles.css`:

```css
:root {
    --zoho-red: #E42527;           /* Primary Zoho brand color */
    --zoho-red-hover: #c41f21;     /* Darker red for hover states */
    --color-text-primary: #333333; /* Main text color */
    --color-text-secondary: #666666; /* Secondary text color */
}
```

### Modifying Signature Layout

Edit the generator methods in `js/signature.js`:

```javascript
generateClassicStyle(data, logoUrl, websiteUrl, contacts, zohoSocialHtml) {
    // Customize HTML structure here
}
```

### Adding New Fields

1. Add input field in `index.html` with toggle switch
2. Update `AppState.formData` and `AppState.fieldToggles` in `js/app.js`
3. Update signature generators in `js/signature.js` to include new field

### Changing Default Values

Update pre-populated values in `index.html`:

```html
<input type="text" id="name" name="name" value="Your Name" required>
```

## 📝 Development Notes

### Code Quality
- ✅ All code is well-commented with JSDoc-style documentation
- ✅ Semantic HTML5 elements throughout
- ✅ Modern ES6+ JavaScript (const/let, arrow functions, template literals)
- ✅ CSS Grid and Flexbox for responsive layouts
- ✅ No unnecessary dependencies or bloat
- ✅ Clean separation of concerns (HTML structure, CSS styling, JS logic)

### Performance
- Debounced input handlers for smooth real-time preview
- Efficient DOM manipulation using `innerHTML` for preview updates
- CSS transitions optimized for 60fps animations
- Minimal reflows and repaints

### Accessibility
- Proper ARIA labels on all interactive elements
- Keyboard navigation fully supported
- Focus trapping in modal for screen reader users
- Required fields properly marked with `aria-required`
- Color contrast ratios meet WCAG AA standards

## 🚀 Deployment

### GitHub Pages (Recommended)

1. Push code to GitHub repository
2. Go to repository Settings → Pages
3. Select source branch (usually `main`)
4. Set folder to `/` (root)
5. Save and wait for deployment (~1 minute)
6. Access at `https://username.github.io/signature-generator/`

### Other Static Hosts

This is a static site and works with any static hosting:
- **Netlify**: Drag and drop the folder
- **Vercel**: Import from GitHub
- **AWS S3**: Upload files with public read access
- **Cloudflare Pages**: Connect to GitHub repository
- **Surge**: `surge /path/to/folder`

## 🔒 Privacy & Security

- ✅ **No server communication**: All processing happens in your browser
- ✅ **No data collection**: Zero tracking, analytics, or cookies
- ✅ **localStorage only**: Theme preference stored locally (optional)
- ✅ **No external dependencies**: No CDN libraries that could track you
- ✅ **Open source**: Code is transparent and auditable

## 🐛 Troubleshooting

### Signature not copying
- Ensure you're using a modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- Check browser clipboard permissions (some browsers require user interaction)
- Try the fallback: it will use `document.execCommand('copy')` if modern API fails
- HTTPS is required for Clipboard API on some browsers (use local file:// for development)

### Toggle switches not working
- Ensure JavaScript is enabled in your browser
- Check browser console (F12) for error messages
- Verify all JS files are loaded correctly in Network tab

### Preview not updating
- Check that JavaScript is enabled
- Verify all form fields have proper `name` attributes
- Look for errors in browser console (F12)

### Signature looks different in email client
- This is expected - email clients have varying CSS support
- Core layout and content will be preserved in all clients
- Test in your specific email client before using in production
- Logo requires internet connection to load from Zoho's CDN

### Social media links not appearing
- Ensure "Include Zoho's official social handles" checkbox is checked
- Verify at least one social channel is selected
- Social section only appears in final signature when enabled

## 📚 Technical Details

### Browser APIs Used
- **Clipboard API** - Modern `navigator.clipboard.write()` with fallback
- **localStorage** - Theme preference persistence
- **Custom Elements** - CSS custom properties for theming
- **CSS Grid & Flexbox** - Responsive layout

### Email HTML Generation
- Table-based layout for maximum compatibility
- Inline styles exclusively (no external stylesheets)
- Absolute URLs for images (Zoho logo CDN)
- Proper HTML escaping to prevent XSS
- Validated email/phone/URL formats

### State Management Pattern
```javascript
const AppState = {
    formData: {...},        // User input values
    fieldToggles: {...},    // Which fields are enabled
    signatureStyle: '...',  // Selected style
    socialOptions: {...},   // Social media config
    isDarkMode: false       // Preview theme
};
```

## 🎯 Future Enhancements (Roadmap)

Potential features for future versions:
- [ ] Save/load multiple signature profiles
- [ ] Export signature as image (PNG/JPG)
- [ ] Export as PDF for printing
- [ ] QR code generation for contact info
- [ ] Bulk generation for teams (CSV import)
- [ ] Admin portal for company-wide templates
- [ ] Custom color scheme picker
- [ ] Image upload for personal photo
- [ ] A/B testing different signature styles
- [ ] Analytics dashboard (if deployed centrally)

## 📄 License

Internal tool for Zoho employees. Not for public distribution.

## 🙏 Credits

- **Design Pattern**: Inspired by Lovable prompt found on X/Twitter
- **Zoho Branding**: Official colors and logo from Zoho brand guidelines
- **Toggle UI**: iOS-style switches for modern, familiar interface
- **Built with**: Vanilla HTML, CSS, and JavaScript (no frameworks)

## 📞 Support

For issues or questions:
1. Check the "How to Import?" modal for email client instructions
2. Review the troubleshooting section above
3. Check browser console (F12) for error messages
4. Contact your IT department for Zoho-specific questions

---

**Version**: 0.1.0
**Release Date**: January 17, 2026
**Built for**: Zoho Corporation
**Repository**: https://github.com/tejasgadhia/signature-generator
