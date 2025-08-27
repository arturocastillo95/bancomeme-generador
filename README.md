# 🏦 Bancomeme Receipt Generator

A sophisticated React-based web application that generates realistic BBVA bank transfer receipts with full customization, professional design, and reliable PNG export functionality. **For educational and entertainment purposes only.**

![BBVA Receipt Preview](https://img.shields.io/badge/React-19.1.1-blue) ![Vite](https://img.shields.io/badge/Vite-7.1.2-purple) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.1.12-cyan) ![Mobile Optimized](https://img.shields.io/badge/Mobile-Optimized-green)

## ✨ Features

### 🎨 Advanced Customization
- **Real-time Preview**: See changes instantly as you type with live updates
- **Complete Field Control**: Customize every aspect of the receipt including:
  - Date and time (auto-initialized to current, Spanish format)
  - Transaction amount (random generation $1.00 - $1,000,000.00)
  - Account numbers (auto-generated 5-digit sequences)
  - Receiver name and bank information
  - Transaction concept and reference numbers
  - Circle color with color picker and manual hex input
  - Auto-generated initials from receiver names

### 📱 Professional Design & UX
- **60-30-10 Color Rule**: Professionally balanced color scheme following design theory
  - 60% Neutral (gray/white backgrounds and primary text)
  - 30% Blue (BBVA brand colors for headers and interactive elements)
  - 10% Orange (accent colors for warnings and secondary CTAs)
- **Mobile-First Responsive**: Optimized for all screen sizes with touch-friendly interfaces
- **CSS Modules**: Complete style isolation preventing conflicts
- **Bancomeme Logo**: Custom branding with logo integration
- **Inter Font**: Google Fonts integration for authentic, professional typography

### 🖼️ Advanced Export System
- **High-Quality PNG Export**: Professional image generation using html2canvas
- **Export-Specific Styling**: Dual rendering system for web preview vs export optimization
- **Full Receipt Capture**: Ensures complete content without truncation or clipping
- **Optimized Rendering**: Enhanced font smoothing, text rendering, and 2x scaling

### 🛡️ User Experience & Safety
- **Interactive Disclaimer**: Humorous but important legal warning modal
- **Accept/Reject Buttons**: User acknowledgment with entertaining responses
- **Random Data Generation**: Quick-fill buttons for realistic test data
- **Form Validation**: Smart input limiting and automatic formatting
- **Accessibility**: Keyboard navigation and screen reader friendly

### 🔧 Smart Features
- **Intelligent Defaults**: Auto-populates with realistic Mexican banking data
- **Circle Initial Generation**: Automatic extraction of initials from names
- **Spanish Date Formatting**: Authentic Mexican date and time formats
- **Currency Formatting**: Proper thousand separators and decimal handling
- **Loading States**: User feedback during export operations

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd receipt-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to `http://localhost:5173`

## 📁 Project Structure

```
receipt-app/
├── public/
│   ├── vite.svg
│   └── bancomeme-logo.png        # Custom Bancomeme branding
├── src/
│   ├── App.jsx                   # Main application component
│   ├── ReceiptComponent.module.css # Isolated receipt styles
│   ├── App.css                   # Component-specific styles
│   ├── receipt.css              # Additional receipt styling
│   ├── index.css                # Global styles and Tailwind
│   ├── main.jsx                 # Application entry point
│   └── assets/
│       └── react.svg            # React logo asset
├── index.html                   # Main HTML template
├── package.json                 # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint configuration
└── README.md                   # This comprehensive guide
```

## 🏗️ Key Components

### App.jsx - Main Application Hub
The primary React component featuring:
- **Sophisticated Form Controls**: Organized sections with icon grouping
- **Advanced State Management**: React hooks with form validation
- **Export Logic**: html2canvas integration with temporary styling system
- **Real-time Updates**: Instant preview synchronization
- **Disclaimer Modal**: Interactive user acknowledgment system
- **Random Data Generation**: One-click realistic data population
- **Mobile Responsive**: Breakpoint-based layout adjustments

### ReceiptComponent.module.css - Styling Engine
CSS Modules file providing:
- **Complete Style Isolation**: Scoped classes with aggressive !important declarations
- **Pixel-Perfect Receipt Layout**: Exact BBVA dimensions and positioning
- **Dual Rendering System**: Separate classes for web (.class) vs export (.classExport)
- **Font Integration**: Inter font family with proper fallbacks
- **Circle Positioning Logic**: Dynamic initials and color handling

### Color System Architecture
Following professional 60-30-10 design rule:
- **60% Neutral Base**: `bg-gray-50`, `bg-white`, `text-gray-800/600`, `border-gray-200`
- **30% Brand Blue**: `bg-blue-600`, `text-blue-600`, `focus:ring-blue-500`, accent elements
- **10% Orange Accents**: `bg-orange-500`, warning highlights, secondary actions

## Configuration

## ⚙️ Configuration & Customization

### Intelligent Default Values
The app automatically generates realistic Mexican banking data:
- **Current date/time** in Spanish format ("27 agosto 2025, 14:30:45")
- **Random amounts** between $1.00 and $1,000,000.00 with proper formatting
- **5-digit account numbers** for both sender and receiver
- **7-digit reference numbers** and **9-digit folio numbers**
- **MBANO tracking keys** with 20 random digits
- **Default receiver**: "EL SAT" with humorous concept "rancheritos y coca de 600"
- **Authentic Mexican bank names**: Banorte, Santander, HSBC, etc.

### Comprehensive Customization Options

#### 💰 Transaction Details
- Date (Spanish format with month names)
- Time (24-hour format with seconds)
- Amount (auto-formatted with thousands separators)
- Transaction concept (editable descriptive text)

#### 🏦 Account Information
- Sender account (5-digit format)
- Receiver account (5-digit format)  
- Receiver name (auto-generates circle initials)
- Receiver bank name (dropdown or custom)
- Circle background color (color picker + manual hex input)

#### 📝 Reference & Tracking Data
- Reference number (7-digit sequence)
- Folio number (9-digit sequence)
- Tracking key (MBANO prefix + 20 digits)
- Email address (editable contact)

#### 🎨 Visual Customization
- Circle color selection with live preview
- Automatic initial extraction (e.g., "EL SAT" → "EL")
- Color validation and fallbacks
- Export-specific styling adjustments

## 🔧 Technical Architecture

### Core Dependencies
```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1", 
  "html2canvas": "^1.4.1",
  "@tailwindcss/vite": "^4.1.12",
  "@vitejs/plugin-react": "^4.3.4",
  "vite": "^7.1.2"
}
```

### Advanced CSS Architecture
- **CSS Modules**: Scoped styling with `.module.css` extension for complete isolation
- **Tailwind CSS v4**: Latest utility-first framework with custom configuration
- **60-30-10 Color System**: Professional design rule implementation
- **Progressive Enhancement**: Mobile-first responsive design principles
- **Font Loading**: Google Fonts Inter family with proper loading strategies

### Sophisticated Export System
The PNG export employs a multi-stage approach for maximum quality:

#### 1. Pre-Export Preparation
```javascript
// Temporary style adjustments for html2canvas
element.classList.add('exporting');
// Removes height constraints, applies export-specific classes
```

#### 2. html2canvas Configuration
```javascript
{
  scale: 2,           // 2x resolution for crisp images
  backgroundColor: '#ffffff',
  useCORS: true,      // Handle external resources
  allowTaint: false,  // Security compliance
  imageTimeout: 15000 // Generous timeout for fonts
}
```

#### 3. Post-Export Cleanup
```javascript
// Automatic restoration of original styles
element.classList.remove('exporting');
// Error handling with guaranteed cleanup
```

### Smart Form Logic
```javascript
// Auto-generate initials from receiver name
const circleText = (receiverName || '').trim().slice(0, 2).toUpperCase();

// Format currency with proper Mexican formatting  
const formatAmount = (amount) => {
  const number = parseFloat(amount);
  return number.toLocaleString('es-MX', { 
    style: 'currency', 
    currency: 'MXN' 
  });
};

// Generate realistic account numbers
const generateAccount = () => 
  Math.floor(10000 + Math.random() * 90000).toString();
```

## 🌐 Browser Compatibility & Testing

### Fully Supported Browsers
- ✅ **Chrome 90+** (Recommended for best performance)
- ✅ **Firefox 88+** (Full feature support)
- ✅ **Safari 14+** (iOS and macOS compatible)  
- ✅ **Edge 90+** (Chromium-based versions)

### Mobile Device Testing
- ✅ **iOS Safari** (iPhone/iPad responsive design)
- ✅ **Chrome Mobile** (Android optimization)
- ✅ **Samsung Internet** (Galaxy device compatibility)

### Feature-Specific Compatibility
| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| PNG Export | ✅ | ✅ | ✅ | ✅ |
| Color Picker | ✅ | ✅ | ⚠️ | ✅ |
| CSS Modules | ✅ | ✅ | ✅ | ✅ |
| Touch Events | ✅ | ✅ | ✅ | ✅ |

*⚠️ Safari color picker has limited styling options*

## 🎯 Development Guide

### Available Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build optimized production bundle
npm run preview      # Preview production build locally
npm run lint         # Run ESLint with auto-fixing
```

### Development Workflow
1. **Hot Reload**: Changes reflect instantly during development
2. **CSS Isolation**: Styles are completely scoped preventing global conflicts
3. **Form Validation**: Account numbers auto-limit to 5 digits with input masking
4. **Export Testing**: Use browser dev tools to debug export rendering issues
5. **Mobile Testing**: Use responsive design mode to test all breakpoints

### Adding New Features

#### Adding Receipt Fields
```javascript
// 1. Add to initial state
const [receiptData, setReceiptData] = useState({
  // existing fields...
  newField: 'default value'
});

// 2. Create form input
<FormField 
  label="New Field" 
  name="newField" 
  value={receiptData.newField}
  onChange={handleChange}
  icon="🆕"
/>

// 3. Update receipt preview
<span className={styles.newFieldStyle}>
  {receiptData.newField}
</span>
```

#### Customizing Colors (60-30-10 Rule)
```javascript
// Neutral (60%): backgrounds, primary text
bg-gray-50, bg-white, text-gray-800, border-gray-200

// Blue (30%): brand elements, interactive
bg-blue-600, text-blue-600, focus:ring-blue-500

// Orange (10%): accents, warnings  
bg-orange-500, text-orange-600
```

#### Styling Modifications
1. **Form UI**: Update Tailwind classes in `App.jsx`
2. **Receipt Design**: Modify `ReceiptComponent.module.css`
3. **Export Adjustments**: Add `.classExport` variants for PNG differences
4. **Responsive**: Use `sm:`, `lg:` prefixes for breakpoint-specific styles

## 🚨 Troubleshooting Guide

### Common Export Issues

**🖼️ Export shows blank or incomplete image**
```bash
# Solutions:
✅ Ensure html2canvas is properly installed: npm install html2canvas
✅ Check browser console for CORS errors
✅ Verify all Google Fonts are loaded before export
✅ Increase imageTimeout in html2canvas config
✅ Test with different browsers (Chrome recommended)
```

**📏 Text positioning differs between preview and export**
```css
/* Use dual class system in CSS modules */
.textElement { /* Web preview styles */ }
.textElementExport { /* Export-specific adjustments */ }
```

**🎨 Styling conflicts or missing styles**
```javascript
// CSS Modules prevent most conflicts, but if issues persist:
✅ Use more specific selectors with !important
✅ Check for global CSS interference 
✅ Verify CSS Modules import paths
✅ Clear browser cache and restart dev server
```

### Form Validation Solutions

**🔢 Account number formatting issues**
```javascript
// Auto-limiting is handled in onChange:
const handleChange = (e) => {
  let { name, value } = e.target;
  if (name.includes('Account') && value.length > 5) {
    value = value.slice(0, 5); // Enforce 5-digit limit
  }
  setReceiptData(prev => ({ ...prev, [name]: value }));
};
```

**⭕ Circle text not updating**
- Circle initials derive from receiver name automatically
- Check if receiver name field is properly connected
- Verify circleText calculation in ReceiptPreview component

### Performance Optimization

**⚡ Slow rendering or export**
```javascript
// Optimize with React.memo for form components
const FormField = React.memo(({ label, name, value, onChange }) => {
  // Component implementation
});

// Debounce rapid state updates
const debouncedUpdate = useCallback(
  debounce((data) => setReceiptData(data), 300),
  []
);
```

**📱 Mobile performance issues**
- Use Chrome DevTools Performance tab
- Check for layout thrashing during form updates
- Optimize CSS transitions and animations
- Test on actual mobile devices

## 🤝 Contributing & Development

### Contributing Guidelines
1. **Fork** the repository to your GitHub account
2. **Clone** your fork: `git clone https://github.com/yourusername/receipt-app.git`
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Follow** the existing code style and conventions
5. **Test** your changes across multiple browsers
6. **Commit** with descriptive messages: `git commit -m 'Add amazing feature'`
7. **Push** to your branch: `git push origin feature/amazing-feature`  
8. **Open** a Pull Request with detailed description

### Code Standards
- Use **ES6+ features** and modern React patterns
- Follow **Tailwind CSS** utility-first approach
- Maintain **CSS Modules** isolation for styling
- Write **descriptive comments** for complex logic
- Ensure **mobile responsiveness** for all new features
- Test **export functionality** thoroughly

### Feature Request Process
Before implementing major features:
1. Open an **Issue** describing the proposed feature
2. Discuss implementation approach
3. Get approval before starting development
4. Follow the contribution workflow above

## ⚖️ Legal & Usage Guidelines

### Educational Purpose Disclaimer
This application is designed **exclusively** for:
- 📚 **Educational demonstrations** of React and web technologies
- 🎭 **Entertainment purposes** and harmless pranks between friends
- 💼 **Portfolio showcases** for developers and designers
- 🧪 **Technical experimentation** with modern web APIs

### Prohibited Uses
❌ **Do NOT use this tool for:**
- Creating fraudulent financial documents
- Deceiving individuals, businesses, or government entities  
- Tax evasion or financial misrepresentation
- Any illegal or unethical activities
- Misleading financial institutions

### BBVA Trademark Notice
This project is **not affiliated** with BBVA Bancomer or any official banking institution. The BBVA name and styling are used purely for educational demonstration of web development techniques. All trademarks belong to their respective owners.

## 🏆 Acknowledgments & Credits

### Open Source Heroes
- **⚛️ React Team** - For the excellent component framework
- **⚡ Vite Team** - For lightning-fast development experience  
- **🎨 Tailwind Labs** - For the utility-first CSS framework
- **🖼️ html2canvas** - For reliable DOM to canvas conversion
- **🔤 Google Fonts** - For the beautiful Inter font family

### Special Recognition
- **Mexican Banking System** - For inspiration on authentic receipt design
- **Design Community** - For 60-30-10 color rule guidance  
- **Open Source Community** - For continuous inspiration and support

---

## 📢 Final Important Notice

**🚨 This application generates completely fictional receipts for demonstration purposes only.**

The receipts created are:
- ❌ **Not legal documents**
- ❌ **Not valid for any official use** 
- ❌ **Not endorsed by BBVA or any bank**
- ✅ **Perfect for learning React and web development**
- ✅ **Great for demonstrating technical skills**
- ✅ **Useful for educational purposes**

**Use responsibly, code ethically, and build amazing things! 🚀**
