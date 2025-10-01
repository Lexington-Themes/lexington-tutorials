# SEO Setup Guide for Lexington Tutorials

This guide explains how to add proper SEO, JSON-LD structured data, and canonical URLs to each tutorial page.

## Overview

The SEO system has been enhanced to support page-specific metadata:

- Custom title, description, and Open Graph images
- Proper canonical URLs
- JSON-LD structured data for rich search results
- Breadcrumb navigation
- Article/Tutorial markup

## How to Use

### 1. Basic Page SEO

For any page, import the JSON-LD utilities and define a `seoConfig` object:

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/utils/jsonLd";

const seoConfig = {
  title: "Your Page Title",
  description: "Your page description (150-160 characters recommended)",
  canonical: "/your-page-url", // Relative URL
  jsonLd: [
    generateArticleSchema({
      title: "Your Page Title",
      description: "Your page description",
      url: "/your-page-url",
      datePublished: "2024-01-15T09:00:00Z",
      dateModified: "2024-01-15T09:00:00Z",
      keywords: ["Tailwind CSS", "Tutorial", "etc"],
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Your Page", url: "/your-page-url" },
    ]),
  ],
};
---

<BaseLayout seo={seoConfig}>
  <!-- Your content -->
</BaseLayout>
```

### 2. Tutorial Pages with HowTo Schema

For step-by-step tutorials, add the HowTo schema for enhanced search results:

```astro
---
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateHowToSchema,
} from "@/utils/jsonLd";

const seoConfig = {
  title: "How to Create X with Tailwind CSS",
  description: "Learn how to build X using Tailwind CSS and JavaScript",
  canonical: "/your-tutorial",
  jsonLd: [
    generateArticleSchema({
      title: "How to Create X with Tailwind CSS",
      description: "Learn how to build X",
      url: "/your-tutorial",
      datePublished: "2024-01-15T09:00:00Z",
      keywords: ["Tailwind CSS", "JavaScript", "Tutorial"],
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Your Tutorial", url: "/your-tutorial" },
    ]),
    generateHowToSchema({
      name: "Create X with Tailwind CSS",
      description: "Step-by-step guide to building X",
      totalTime: "PT20M", // ISO 8601 duration (e.g., PT20M = 20 minutes)
      steps: [
        {
          name: "Step 1 Name",
          text: "Description of what to do in step 1",
        },
        {
          name: "Step 2 Name",
          text: "Description of what to do in step 2",
        },
        // Add more steps...
      ],
    }),
  ],
};
---
```

### 3. Collection/Listing Pages

For pages that list multiple items:

```astro
---
import { generateCollectionPageSchema } from "@/utils/jsonLd";

const seoConfig = {
  title: "Collection Name",
  description: "Browse our collection of X",
  canonical: "/collection",
  jsonLd: [
    generateCollectionPageSchema({
      title: "Collection Name",
      description: "Browse our collection of X",
      url: "/collection",
    }),
  ],
};
---
```

## Available JSON-LD Schemas

### 1. `generateArticleSchema()`

For tutorial/article pages. Helps with article rich results.

**Parameters:**

- `title` (required): Article title
- `description` (required): Article description
- `url` (required): Relative or absolute URL
- `datePublished` (optional): ISO 8601 date string
- `dateModified` (optional): ISO 8601 date string
- `author` (optional): Author name (default: "Lexington Themes")
- `image` (optional): Image URL
- `keywords` (optional): Array of keywords

### 2. `generateBreadcrumbSchema()`

For breadcrumb navigation. Helps with breadcrumb rich results.

**Parameters:**

- `items`: Array of `{ name: string, url: string }`

**Example:**

```javascript
generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Tutorials", url: "/tutorials" },
  { name: "Current Page", url: "/tutorials/current" },
]);
```

### 3. `generateHowToSchema()`

For step-by-step tutorials. Helps with HowTo rich results.

**Parameters:**

- `name` (required): Tutorial name
- `description` (required): Tutorial description
- `image` (optional): Tutorial image
- `totalTime` (optional): ISO 8601 duration (e.g., "PT30M" for 30 minutes)
- `steps` (required): Array of step objects

**Step object:**

```javascript
{
  name: "Step name",
  text: "Step description",
  url: "Optional URL",
  image: "Optional image URL"
}
```

### 4. `generateCollectionPageSchema()`

For collection/listing pages.

**Parameters:**

- `title` (required): Collection title
- `description` (required): Collection description
- `url` (required): Collection URL

### 5. `generateFAQSchema()`

For FAQ pages.

**Parameters:**

- `questions`: Array of `{ question: string, answer: string }`

**Example:**

```javascript
generateFAQSchema([
  {
    question: "How do I use this?",
    answer: "You can use this by following these steps...",
  },
]);
```

### 6. `generateWebSiteSchema()` and `generateOrganizationSchema()`

Already included on the homepage. No need to add to individual pages.

## Best Practices

### Titles

- Keep under 60 characters
- Include primary keyword
- Make it unique per page
- Site name is automatically appended

### Descriptions

- Keep between 150-160 characters
- Include a call to action
- Make it compelling and unique
- Include relevant keywords naturally

### Canonical URLs

- Use relative URLs (e.g., `/accordion`)
- System automatically converts to absolute URLs
- Ensure each page has a unique canonical

### Keywords

- Use 5-10 relevant keywords
- Include technology names (Tailwind CSS, Alpine.js, etc.)
- Include component type (carousel, modal, etc.)
- Include skill level if relevant

### Dates

- Use ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`
- Example: `2024-01-15T09:00:00Z`
- Include timezone (Z for UTC)
- Set `dateModified` when updating content

## Time Durations (ISO 8601)

For `totalTime` in HowTo schemas:

- `PT10M` = 10 minutes
- `PT30M` = 30 minutes
- `PT1H` = 1 hour
- `PT1H30M` = 1 hour 30 minutes
- `P1D` = 1 day

## Example: Complete Tutorial Page

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import Wrapper from "@/components/fundations/containers/Wrapper.astro";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateHowToSchema,
} from "@/utils/jsonLd";

const seoConfig = {
  title: "How to Create a Modal with Tailwind CSS and Alpine.js",
  description:
    "Learn to build an accessible modal dialog using Tailwind CSS and Alpine.js. Includes animations, keyboard navigation, and focus management.",
  canonical: "/modal-tutorial",
  jsonLd: [
    generateArticleSchema({
      title: "How to Create a Modal with Tailwind CSS and Alpine.js",
      description:
        "Complete guide to building accessible modal dialogs with Tailwind CSS and Alpine.js",
      url: "/modal-tutorial",
      datePublished: "2024-03-15T10:00:00Z",
      dateModified: "2024-03-20T14:30:00Z",
      keywords: [
        "Tailwind CSS",
        "Alpine.js",
        "Modal",
        "Dialog",
        "Accessibility",
        "Web Development",
        "Tutorial",
      ],
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Modal Tutorial", url: "/modal-tutorial" },
    ]),
    generateHowToSchema({
      name: "Create an Accessible Modal with Tailwind CSS",
      description: "Build a fully accessible modal dialog component",
      totalTime: "PT25M",
      steps: [
        {
          name: "Set up the HTML structure",
          text: "Create the modal container, overlay, and content area",
        },
        {
          name: "Add Alpine.js state management",
          text: "Initialize Alpine.js data to control modal visibility",
        },
        {
          name: "Style with Tailwind CSS",
          text: "Apply utility classes for layout, colors, and animations",
        },
        {
          name: "Add accessibility features",
          text: "Implement focus trapping, ARIA attributes, and keyboard support",
        },
        {
          name: "Test the modal",
          text: "Verify functionality across different browsers and screen readers",
        },
      ],
    }),
  ],
};
---

<BaseLayout seo={seoConfig}>
  <Wrapper>
    <!-- Your modal tutorial content -->
  </Wrapper>
</BaseLayout>
```

## Testing Your SEO

### Test Tools

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema.org Validator**: https://validator.schema.org/
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
4. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/

### What to Check

- ✅ Title appears correctly in search results
- ✅ Description is compelling and accurate
- ✅ Canonical URL is correct
- ✅ JSON-LD validates without errors
- ✅ Open Graph image displays properly
- ✅ Breadcrumbs appear in search results
- ✅ Rich results preview looks good

## Common Issues

### Issue: Multiple pages have the same title

**Solution**: Make each title unique by including the specific component/feature name

### Issue: JSON-LD validation errors

**Solution**: Check that all required fields are filled and dates are in ISO 8601 format

### Issue: Canonical URL conflicts

**Solution**: Ensure each page has a unique canonical URL without duplicates

### Issue: Missing breadcrumbs in search results

**Solution**: Verify breadcrumb schema is included and URLs are correct

## Migration Checklist

For each page in your project:

- [ ] Import JSON-LD utilities
- [ ] Create `seoConfig` object
- [ ] Add unique title (under 60 chars)
- [ ] Add compelling description (150-160 chars)
- [ ] Set canonical URL
- [ ] Add Article schema with keywords
- [ ] Add Breadcrumb schema
- [ ] Add HowTo schema (for tutorials)
- [ ] Set publish/modified dates
- [ ] Pass `seo={seoConfig}` to `<BaseLayout>`
- [ ] Test with validation tools

## Need Help?

If you need to customize the SEO further:

1. Edit `/src/components/fundations/head/Seo.astro` for global SEO settings
2. Edit `/src/utils/jsonLd.ts` to add new schema types
3. Refer to Schema.org documentation: https://schema.org/
