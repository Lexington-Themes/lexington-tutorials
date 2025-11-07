# SEO System Architecture

## System Overview

```

                     Your Page File
                  (e.g., accordion/index)


  1. Import utilities:
     import { generateArticleSchema } from "@/utils/jsonLd"

  2. Define seoConfig object:
     const seoConfig = {
       title: "...",
       description: "...",
       canonical: "/page",
       jsonLd: [schemas...]
     }

  3. Pass to BaseLayout:
     <BaseLayout seo={seoConfig}>





                    BaseLayout.astro
                 (src/layouts/BaseLayout.astro)


  - Receives seo prop
  - Passes to BaseHead component
  - Wraps your content with nav/footer





                     BaseHead.astro
           (src/components/fundations/head/BaseHead.astro)


  - Receives seo prop
  - Passes to Seo component
  - Includes Meta, Fonts, Favicons, Alpine





                       Seo.astro
           (src/components/fundations/head/Seo.astro)


  1. Processes seo config
  2. Generates canonical URL
  3. Builds full title
  4. Renders:
     - <title> tag
     - <meta> tags
     - Open Graph tags
     - Twitter Card tags
     - JSON-LD <script> tag


```

## Data Flow

```
Page File                    Utils                    Components


Your content
                  jsonLd.ts

      calls       Functions:
      - Article
                  - Breadcrumb
                  - HowTo
                  - FAQ
                  - etc.


                       returns
                       schema objects


                  seoConfig
                  {
                    title,
                    description,
                    canonical,
                    jsonLd: [...]
                  }


      passes



      BaseLayout
                   seo={...}




                   BaseHead
                   seo={...}




                   Seo.astro
                   {...seo}




                   HTML Output
                   - <title>
                   - <meta>
                   - <script>

```

## File Structure

```
lexington-tutorials/

 src/
    components/
       fundations/
           head/
               Seo.astro          ← SEO component (modified)
               BaseHead.astro     ← Head wrapper (modified)
               Meta.astro
               Fonts.astro
               Favicons.astro

    layouts/
       BaseLayout.astro           ← Main layout (modified)

    pages/
       _template.astro            ← NEW: Template for new pages
       index.astro                ← Updated with SEO
       accordion/
          index.astro            ← Example: Full SEO
       carousel/
          index.astro            ← Example: Full SEO
       [other pages]/
           index.astro            ← To be updated

    utils/
        jsonLd.ts                  ← NEW: JSON-LD utilities

 scripts/
    seo-audit.js                   ← NEW: Audit tool

 SEO-IMPLEMENTATION.md              ← NEW: Implementation guide
 SEO-GUIDE.md                       ← NEW: Usage guide
 SEO-CHEATSHEET.md                  ← NEW: Quick reference
 README-SEO.md                      ← NEW: Quick start
 package.json                       ← Added seo:audit script
```

## Typical Update Flow

```

  1. Start with
     _template.astro


            copy


  2. Replace
     [PLACEHOLDERS]


            customize


  3. Add your
     component code


            save


  4. Test in dev
     npm run dev


            verify


  5. Run audit
     npm run
     seo:audit


            commit


  6. Done!

```

## Schema Relationships

```
Page Types and Their Schemas:


Homepage
 WebSiteSchema          (site info)
 OrganizationSchema     (company info)
 CollectionPageSchema   (page type)

Tutorial Page
 ArticleSchema          (article metadata)
 BreadcrumbSchema       (navigation)
 HowToSchema            (steps)

FAQ Page
 ArticleSchema          (article metadata)
 BreadcrumbSchema       (navigation)
 FAQSchema              (Q&A pairs)

Collection Page
 CollectionPageSchema   (collection info)
 BreadcrumbSchema       (navigation)

Simple Page
 ArticleSchema          (article metadata)
 BreadcrumbSchema       (navigation)
```

## JSON-LD Utility Functions

```
jsonLd.ts exports:


generateOrganizationSchema()
 Returns: Organization schema
    Use: Homepage (once)

generateWebSiteSchema()
 Returns: WebSite schema
    Use: Homepage (once)

generateBreadcrumbSchema(items)
 Input: Array of {name, url}
 Returns: BreadcrumbList schema
    Use: Every page

generateArticleSchema(config)
 Input: {title, description, url, date, keywords}
 Returns: TechArticle schema
    Use: Tutorial/content pages

generateHowToSchema(config)
 Input: {name, description, steps}
 Returns: HowTo schema
    Use: Step-by-step tutorials

generateFAQSchema(questions)
 Input: Array of {question, answer}
 Returns: FAQPage schema
    Use: FAQ pages

generateCollectionPageSchema(config)
 Input: {title, description, url}
 Returns: CollectionPage schema
    Use: Listing/index pages
```

## SEO Config Object Structure

```javascript
const seoConfig = {
  // Basic SEO
  title: string,              // Required, <60 chars
  description: string,        // Required, 150-160 chars
  canonical: string,          // Required, relative URL

  // Optional
  ogImage: string,           // Custom OG image URL
  ogImageAlt: string,        // OG image alt text

  // For blog posts/articles
  article: {
    publishedTime: string,   // ISO 8601 date
    modifiedTime: string,    // ISO 8601 date
    author: string,          // Author name
    tags: string[],          // Tag array
  },

  // Structured data
  jsonLd: [                  // Array of schemas
    generateArticleSchema({...}),
    generateBreadcrumbSchema([...]),
    generateHowToSchema({...}),
    // ... more schemas
  ],
}
```

## Component Prop Flow

```
Page Component

   seo={seoConfig}

BaseLayout

   seo={seo}

BaseHead

   {...seo}

Seo Component

   title → <title> + OpenGraph + Twitter
   description → <meta> + OpenGraph + Twitter
   canonical → <link rel="canonical">
   ogImage → OpenGraph image tags
   article → OpenGraph article tags
   jsonLd → <script type="application/ld+json">
```

## Output in HTML

```html
<head>
  <!-- From Seo.astro -->
  <title>Your Title | Lexington Themes Tutorials</title>
  <meta name="description" content="Your description" />
  <link
    rel="canonical"
    href="https://tutorials.lexingtonthemes.com/your-page"
  />

  <!-- Open Graph -->
  <meta property="og:title" content="Your Title | Lexington Themes Tutorials" />
  <meta property="og:description" content="Your description" />
  <meta
    property="og:url"
    content="https://tutorials.lexingtonthemes.com/your-page"
  />
  <meta
    property="og:image"
    content="https://tutorials.lexingtonthemes.com/images/openGraph.png"
  />
  <meta property="og:type" content="article" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@LexingtonThemes" />

  <!-- JSON-LD -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "Your Title",
      ...
    }
  </script>

  <!-- From other components -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <!-- fonts, favicons, etc. -->
</head>
```

## Audit Tool Logic

```
seo-audit.js
 Scans src/pages/**/*.astro
 Checks each file for:
    Has seoConfig?
    Has title?
    Has description?
    Has canonical?
    Has jsonLd?
    Has schemas?
    Passes to BaseLayout?
 Categorizes:
     Fully optimized (all checks pass)
     Partially optimized (some checks pass)
     Needs optimization (no checks pass)
 Outputs:
     Summary stats
     Detailed list per category
     Exit code (1 if any need work)
```

## Example Implementations

### Minimal (Simple Page)

```astro
const seoConfig = {
  title: "Page Title",
  description: "Page description",
  canonical: "/page",
  jsonLd: [
    generateArticleSchema({...}),
    generateBreadcrumbSchema([...]),
  ],
};
```

### Standard (Tutorial)

```astro
const seoConfig = {
  title: "Tutorial Title",
  description: "Tutorial description",
  canonical: "/tutorial",
  jsonLd: [
    generateArticleSchema({...}),
    generateBreadcrumbSchema([...]),
    generateHowToSchema({...}),
  ],
};
```

### Advanced (Homepage)

```astro
const seoConfig = {
  title: "Site Title",
  description: "Site description",
  canonical: "/",
  jsonLd: [
    generateWebSiteSchema(),
    generateOrganizationSchema(),
    generateCollectionPageSchema({...}),
  ],
};
```

---

This architecture provides:

- Separation of concerns
- Reusable utilities
- Type-safe configurations
- Easy maintenance
- Scalable to 100s of pages
