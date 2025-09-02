# Contributing to Vontext Free React Templates

Thank you for your interest in contributing to our collection of **free React templates**! We welcome contributions from developers of all skill levels.

## 🎯 What We're Looking For

We're always looking for high-quality, modern React templates that help developers build faster:

### Template Categories
- **SaaS Dashboards** - Analytics, admin panels, data visualization
- **Landing Pages** - Marketing, product launches, services
- **E-commerce** - Online stores, product catalogs, shopping carts
- **Creator Economy** - Content platforms, subscription sites, donation platforms
- **Portfolio & Personal** - Personal websites, portfolios, blogs
- **Business Applications** - CRM, project management, team collaboration

### Quality Standards
All templates must meet these requirements:
- ✅ Built with **React 19** + **TypeScript**
- ✅ Styled with **TailwindCSS v4**
- ✅ Built with **Vite** for optimal performance
- ✅ **Fully responsive** design (mobile-first)
- ✅ **Production-ready** code quality
- ✅ **Accessible** (WCAG guidelines)
- ✅ **Modern UI/UX** following current trends
- ✅ **Well-documented** and commented code

## 🚀 How to Contribute

### 1. Template Contributions

#### Step 1: Setup Development Environment
```bash
# Fork and clone the repository
git clone https://github.com/[your-username]/vontext.templates.git
cd vontext.templates

# Create a new branch
git checkout -b feature/new-template-name
```

#### Step 2: Create Your Template
```bash
# Navigate to templates directory
cd templates

# Create your template folder
mkdir your-template-name
cd your-template-name

# Initialize React + TypeScript + Vite project
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss@next @tailwindcss/postcss autoprefixer
```

#### Step 3: Template Structure
Your template should follow this structure:
```
templates/your-template-name/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── App.tsx             # Main app
│   ├── main.tsx            # Entry point
│   ├── index.css          # Global styles
│   └── vite-env.d.ts      # Type definitions
├── public/                 # Static assets
├── package.json           # Dependencies
├── tailwind.config.js     # TailwindCSS config
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
├── README.md              # Template documentation
└── ...
```

#### Step 4: Add Metadata
Create metadata file at `metadata/your-template-name/meta.json`:
```json
{
    "name": "Your Template Name",
    "slogan": "Your compelling tagline",
    "description": "Detailed description of your template and its use cases",
    "images": ["your-template-name/screenshot.png"],
    "download_count": "0",
    "tags": ["react", "typescript", "tailwindcss", "landing-page"],
    "like_count": "0",
    "view_count": "0",
    "created_at": "2024-12-19T12:00:00Z",
    "updated_at": "2024-12-19T12:00:00Z",
    "tech_stack": ["React 19", "TypeScript", "TailwindCSS v4", "Vite"],
    "key_features": ["Feature 1", "Feature 2", "Feature 3"]
}
```

#### Step 5: Add Screenshot
- Create a high-quality screenshot (1200x800px recommended)
- Save as `metadata/your-template-name/screenshot.png`
- Show the template's main features and design

#### Step 6: Update Main README
Add your template to the main README.md table:
```markdown
| [![Your Template Preview](metadata/your-template-name/screenshot.png)](metadata/your-template-name/screenshot.png) | **[Your Template Name](templates/your-template-name/)** | **Template Category** | Brief description | Tech Stack | Key Features |
```

#### Step 7: Template Documentation
Create a comprehensive `README.md` in your template folder:
```markdown
# Your Template Name

Brief description of what this template does.

## Features
- List key features
- Highlight unique aspects
- Mention target use cases

## Tech Stack
- React 19
- TypeScript
- TailwindCSS v4
- Vite

## Getting Started
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build for production: `npm run build`

## Components
Brief description of main components.

## Customization
How to customize colors, typography, etc.
```

### 2. Bug Fixes & Improvements

#### Reporting Bugs
- Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Include template name, steps to reproduce, and environment details
- Add screenshots if applicable

#### Fixing Bugs
- Reference the issue number in your PR
- Test your fix thoroughly
- Ensure no new issues are introduced

### 3. Documentation Improvements

We welcome improvements to:
- README files
- Code comments
- Setup instructions
- Best practices documentation

## 📝 Submission Process

### Before Submitting
- [ ] Template builds successfully (`npm run build`)
- [ ] Development server runs without errors (`npm run dev`)
- [ ] All TypeScript types are properly defined
- [ ] Code follows our formatting standards
- [ ] Responsive design works on all devices
- [ ] Accessibility best practices followed
- [ ] Performance optimized
- [ ] Documentation is complete
- [ ] Screenshot added to metadata folder
- [ ] Main README.md updated with template entry

### Pull Request Process
1. **Template already added to main README.md** during development
2. **Fill out the PR template** completely
3. **Add screenshots** of your template
4. **Write a clear description** of what your template does
5. **Link any related issues**

### Code Review Process
1. Automated checks must pass
2. Code review by maintainers
3. Testing on multiple devices/browsers
4. Documentation review
5. Final approval and merge

## 🎨 Design Guidelines

### UI/UX Principles
- **Mobile-first** responsive design
- **Accessibility** - WCAG 2.1 AA compliance
- **Performance** - Fast loading times
- **Modern aesthetics** - Current design trends
- **User-friendly** - Intuitive navigation and interactions

### Code Quality
- **TypeScript** - Full type safety
- **Component architecture** - Reusable, modular components
- **Clean code** - Readable, maintainable, well-commented
- **Performance** - Optimized for production
- **Standards** - Follow React and TypeScript best practices

## 🏷️ Template Categories & Tags

### Primary Categories
- `saas-dashboard` - Admin panels, analytics, data management
- `landing-page` - Marketing sites, product launches
- `e-commerce` - Online stores, product catalogs
- `creator-platform` - Content creators, subscriptions, donations
- `portfolio` - Personal sites, portfolios, blogs
- `business-app` - CRM, project management, productivity

### Technology Tags
- `react-19` - Latest React features
- `typescript` - Type-safe development
- `tailwindcss-v4` - Modern CSS framework
- `vite` - Fast build tool
- `responsive` - Mobile-friendly design
- `dark-theme` - Dark mode support
- `accessibility` - WCAG compliant

## 🚫 What We Don't Accept

- Templates with poor code quality
- Non-responsive designs
- Templates using outdated technologies
- Copies of existing templates
- Templates with accessibility issues
- Commercial templates (must be free)
- Templates with security vulnerabilities

## 🤝 Community Guidelines

### Be Respectful
- Treat all contributors with respect
- Provide constructive feedback
- Help newcomers learn and improve

### Quality Over Quantity
- Focus on creating high-quality templates
- Test thoroughly before submitting
- Document your code well

### Collaboration
- Help review other PRs when possible
- Share knowledge and best practices
- Support the open-source community

## 📞 Getting Help

- **Questions?** Open an [issue](../../issues) with the `question` label
- **Need help?** Check existing issues or start a discussion
- **Want to chat?** Reach out via [email](mailto:korbinzhao@gmail.com)

## 🎉 Recognition

Contributors will be:
- Listed in our README acknowledgments
- Credited in template documentation
- Featured in release notes
- Given contributor badges (if applicable)

---

Thank you for helping make Vontext Free React Templates the best collection of modern, high-quality React templates for developers! 🚀
