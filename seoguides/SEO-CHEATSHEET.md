# SEO Quick Reference Cheatsheet

## Basic Page Setup (Copy-Paste Ready)

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/utils/jsonLd";

const seoConfig = {
  title: "Your Title Here (Under 60 chars)",
  description: "Your description here (150-160 chars)",
  canonical: "/page-url",
  jsonLd: [
    generateArticleSchema({
      title: "Your Title Here",
      description: "Your description here",
      url: "/page-url",
      datePublished: "2024-10-01T09:00:00Z",
      keywords: ["Keyword1", "Keyword2", "Keyword3"],
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Page Name", url: "/page-url" },
    ]),
  ],
};
---

<BaseLayout seo={seoConfig}>
  <!-- Your content -->
</BaseLayout>
```

## Tutorial Page with HowTo Schema

```astro
import { generateArticleSchema, generateBreadcrumbSchema, generateHowToSchema } from "@/utils/jsonLd";

const seoConfig = {
  title: "How to Create X with Tailwind CSS",
  description: "Learn to build X using Tailwind CSS and Alpine.js",
  canonical: "/tutorial-url",
  jsonLd: [
    generateArticleSchema({
      title: "How to Create X with Tailwind CSS",
      description: "Complete tutorial for building X",
      url: "/tutorial-url",
      datePublished: "2024-10-01T09:00:00Z",
      keywords: ["Tailwind CSS", "Alpine.js", "X Component"],
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Tutorial", url: "/tutorial-url" },
    ]),
    generateHowToSchema({
      name: "Create X with Tailwind CSS",
      description: "Build X component",
      totalTime: "PT20M",
      steps: [
        { name: "Step 1", text: "Do this first" },
        { name: "Step 2", text: "Then do this" },
        { name: "Step 3", text: "Finally do this" },
      ],
    }),
  ],
};
```

## Time Duration Format

```javascript
"PT10M"; // 10 minutes
"PT30M"; // 30 minutes
"PT1H"; // 1 hour
"PT1H30M"; // 1 hour 30 minutes
"PT2H"; // 2 hours
```

## Date Format (ISO 8601)

```javascript
"2024-10-01T09:00:00Z"; // October 1, 2024, 9:00 AM UTC
"2024-01-15T14:30:00Z"; // January 15, 2024, 2:30 PM UTC
```

Get current date:

```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

## Common Keywords by Category

### Tailwind CSS Components

```javascript
["Tailwind CSS", "Component", "Web Design", "Tutorial", "CSS Framework"];
```

### Alpine.js Components

```javascript
["Alpine.js", "Tailwind CSS", "Interactive", "JavaScript", "Tutorial"];
```

### JavaScript Components

```javascript
["JavaScript", "Vanilla JS", "Tailwind CSS", "Web Development", "Tutorial"];
```

### Astro Components

```javascript
["Astro", "Tailwind CSS", "Static Site", "Component", "Tutorial"];
```

### Animation

```javascript
["Animation", "CSS Animation", "Tailwind CSS", "Motion", "Tutorial"];
```

### Forms

```javascript
["Form", "Input", "Validation", "User Input", "Tailwind CSS", "Tutorial"];
```

### Navigation

```javascript
["Navigation", "Menu", "UI Component", "Tailwind CSS", "Tutorial"];
```

## Title Templates

```
"How to Create [COMPONENT] with Tailwind CSS and [FRAMEWORK]"
"Build a [FEATURE] [COMPONENT] with Tailwind CSS"
"Create an Animated [COMPONENT] with Tailwind CSS"
"[COMPONENT] Tutorial with Tailwind CSS and [FRAMEWORK]"
```

Examples:

- "How to Create a Modal Dialog with Tailwind CSS and Alpine.js"
- "Build a Responsive Carousel with Tailwind CSS"
- "Create an Animated Accordion with Tailwind CSS"
- "Modal" (too short)
- "How to Create a Fully Responsive, Accessible, Animated Modal Dialog Component with Advanced Features using Tailwind CSS and Alpine.js Framework" (too long)

## Description Templates

```
"Learn how to build [COMPONENT] using [TECH]. [KEY BENEFIT]."
"Step-by-step tutorial for creating [COMPONENT] with [TECH] and [TECH]."
"Build [ADJ] [COMPONENT] with [TECH]. Includes [FEATURE], [FEATURE], and [FEATURE]."
```

Examples:

- "Learn to build an accessible modal dialog using Tailwind CSS and Alpine.js. Includes animations, keyboard navigation, and focus management."
- "Step-by-step tutorial for creating a responsive carousel with Tailwind CSS and JavaScript. Features smooth scrolling and touch support."
- "Build an interactive accordion with Tailwind CSS and Alpine.js. Includes smooth animations and accessible markup."

## Breadcrumb Patterns

### Simple Page

```javascript
[
  { name: "Home", url: "/" },
  { name: "Page Name", url: "/page-url" },
];
```

### Category Page

```javascript
[
  { name: "Home", url: "/" },
  { name: "Category", url: "/category" },
  { name: "Page Name", url: "/category/page" },
];
```

### Tutorial Subcategory

```javascript
[
  { name: "Home", url: "/" },
  { name: "Tutorials", url: "/tutorials" },
  { name: "JavaScript", url: "/tutorials/javascript" },
  { name: "Carousel Tutorial", url: "/tutorials/javascript/carousel" },
];
```

## HowTo Steps Examples

### Component Tutorial

```javascript
steps: [
  { name: "Set up HTML structure", text: "Create container and elements" },
  { name: "Add Alpine.js data", text: "Initialize state management" },
  { name: "Style with Tailwind CSS", text: "Apply utility classes" },
  { name: "Add interactivity", text: "Implement click handlers" },
  { name: "Test component", text: "Verify functionality" },
];
```

### Animation Tutorial

```javascript
steps: [
  { name: "Create base element", text: "Set up HTML structure" },
  { name: "Add Tailwind classes", text: "Apply initial styles" },
  { name: "Add animation utilities", text: "Use Tailwind animation classes" },
  { name: "Customize timing", text: "Adjust duration and easing" },
];
```

### Form Tutorial

```javascript
steps: [
  { name: "Create form markup", text: "Set up form elements" },
  { name: "Add validation", text: "Implement input validation" },
  { name: "Style with Tailwind", text: "Apply form styles" },
  { name: "Handle submission", text: "Process form data" },
];
```

## Common Component Keywords

| Component  | Keywords                                |
| ---------- | --------------------------------------- |
| Modal      | Modal, Dialog, Popup, Overlay, Lightbox |
| Carousel   | Carousel, Slider, Gallery, Slideshow    |
| Accordion  | Accordion, Collapse, Expandable, Toggle |
| Tabs       | Tabs, Tab Panel, Navigation             |
| Dropdown   | Dropdown, Select, Menu, Combobox        |
| Tooltip    | Tooltip, Popover, Hint                  |
| Form       | Form, Input, Validation, Submit         |
| Table      | Table, Data Grid, List                  |
| Card       | Card, Panel, Widget                     |
| Button     | Button, CTA, Action                     |
| Navigation | Navigation, Menu, Nav, Header           |
| Footer     | Footer, Site Footer                     |
| Sidebar    | Sidebar, Side Navigation, Drawer        |

## Validation Checklist

Before committing a page:

- [ ] Title under 60 characters
- [ ] Description 150-160 characters
- [ ] Canonical URL is correct (starts with `/`)
- [ ] Date in ISO 8601 format
- [ ] 5-10 relevant keywords
- [ ] Breadcrumb includes all levels
- [ ] HowTo steps are clear and actionable (if applicable)
- [ ] `seo={seoConfig}` passed to BaseLayout
- [ ] Run `npm run seo:audit` to verify

## Quick Commands

```bash
# Run development server
npm run dev

# Build project
npm run build

# Run SEO audit
npm run seo:audit

# Get current UTC date (macOS)
date -u +"%Y-%m-%dT%H:%M:%SZ"

# Copy template for new page
cp src/pages/_template.astro src/pages/new-page/index
```

## Testing URLs

- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema Markup Validator: https://validator.schema.org/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- LinkedIn Inspector: https://www.linkedin.com/post-inspector/

## Common Mistakes to Avoid

**Don't**:

- Use same title/description on multiple pages
- Forget to update dateModified when content changes
- Make title over 60 characters
- Use absolute URLs for canonical (use relative: `/page`)
- Skip breadcrumbs
- Use vague keywords like "tutorial" alone
- Copy-paste without customizing

  **Do**:

- Make each page unique
- Update dates when editing
- Keep titles concise
- Use relative canonical URLs
- Always include breadcrumbs
- Use specific, relevant keywords
- Customize for each page's content

## Time Estimates

- Simple page (no HowTo): ~3-5 minutes
- Tutorial page (with HowTo): ~5-8 minutes
- Complex page (multiple schemas): ~10-15 minutes
- Batch of 10 similar pages: ~45-60 minutes

## Priority Order

1. **Homepage** (Done)
2. **Top 10 most visited tutorials**
3. **All Alpine.js tutorials**
4. **All JavaScript tutorials**
5. **All Tailwind CSS tutorials**
6. **HTML element tutorials**
7. **Remaining pages**

---

**Pro Tip**: Work in batches of 5-10 similar pages. The first one takes longer, but subsequent pages in the same category go much faster since you can copy and adapt.
