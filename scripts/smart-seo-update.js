#!/usr/bin/env node

/**
 * Smart SEO updater that preserves existing code
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, "..", "src", "pages");

const pagesToUpdate = [
  "adaptable-navigation",
  "alpine-sidebar",
  "alpine-testimonial",
  "animated-avatar-widget",
  "animated-blog-cards",
  "animated-images",
  "expandable-gallery",
  "flyout-menu",
  "invoice",
  "js-masonry-layout",
  "js-testimonial",
  "js-theme-toggle",
  "multicolumn-layout",
  "pricing-table-toggle-with-javascript",
  "pricing-table",
  "simplified-cards",
  "simplified-markup",
  "sticky-changelog",
  "tailwind-faq",
  "theme-toggle",
];

function addSEOToPage(pageName) {
  const filePath = path.join(PAGES_DIR, pageName, "index.astro");
  const content = fs.readFileSync(filePath, "utf-8");

  // Check if already has SEO
  if (content.includes("const seoConfig")) {
    return { status: "skipped", reason: "Already has SEO" };
  }

  // Extract existing frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return { status: "error", reason: "No frontmatter found" };
  }

  const existingFrontmatter = frontmatterMatch[1];

  // Check if needs JSON-LD imports
  const needsJsonLdImports = !existingFrontmatter.includes(
    'from "@/utils/jsonLd"'
  );

  const canonical = `/${pageName}`;
  const now = new Date().toISOString();

  // Detect component type
  let title, description, keywords;

  if (pageName.includes("testimonial")) {
    const framework = pageName.startsWith("js-") ? "JavaScript" : "Alpine.js";
    title = `Create a Testimonial Component with ${framework}`;
    description = `Learn to build testimonial components using ${framework} and Tailwind CSS. Includes carousel functionality and responsive design.`;
    keywords = [
      `${framework}`,
      "Testimonial",
      "Carousel",
      "Tailwind CSS",
      "Tutorial",
    ];
  } else if (pageName.includes("sidebar")) {
    title = "Create a Sidebar with Alpine.js and Tailwind CSS";
    description =
      "Learn to build an interactive sidebar navigation with Alpine.js and Tailwind CSS. Includes slide animations and responsive design.";
    keywords = [
      "Alpine.js",
      "Sidebar",
      "Navigation",
      "Tailwind CSS",
      "Tutorial",
    ];
  } else if (pageName.includes("navigation")) {
    title = "Create an Adaptive Navigation with Alpine.js";
    description =
      "Learn to build an adaptive navigation component using Alpine.js and Tailwind CSS. Includes scroll effects and smooth animations.";
    keywords = [
      "Alpine.js",
      "Navigation",
      "Scroll Effects",
      "Tailwind CSS",
      "Tutorial",
    ];
  } else if (pageName.includes("pricing-table")) {
    const hasToggle = pageName.includes("toggle");
    title = hasToggle
      ? "Create a Pricing Table with Toggle Switch"
      : "Create a Pricing Table with Tailwind CSS";
    description = hasToggle
      ? "Learn to build a pricing table with toggle switch using JavaScript and Tailwind CSS. Includes smooth animations and responsive layout."
      : "Learn to build a pricing table component using Tailwind CSS. Includes responsive design and modern styling.";
    keywords = [
      "Tailwind CSS",
      "Pricing Table",
      "Toggle",
      "JavaScript",
      "Tutorial",
    ];
  } else {
    // Generic fallback
    const displayName = pageName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    title = `Create ${displayName} with Tailwind CSS`;
    description = `Learn to build ${displayName.toLowerCase()} components using Tailwind CSS. Includes responsive design and modern styling.`;
    keywords = ["Tailwind CSS", displayName, "Tutorial", "Web Development"];
  }

  // Build new frontmatter
  let newFrontmatter = existingFrontmatter;

  // Add JSON-LD imports if needed
  if (needsJsonLdImports) {
    const importInsertPoint = newFrontmatter.lastIndexOf("import");
    const importEndIndex = newFrontmatter.indexOf("\n", importInsertPoint);
    newFrontmatter =
      newFrontmatter.substring(0, importEndIndex + 1) +
      `import {\n  generateArticleSchema,\n  generateBreadcrumbSchema,\n  generateHowToSchema,\n} from "@/utils/jsonLd";\n` +
      newFrontmatter.substring(importEndIndex + 1);
  }

  // Add SEO config before any const declarations or at the end
  const seoConfig = `
// SEO Configuration
const seoConfig = {
  title: "${title}",
  description: "${description}",
  canonical: "${canonical}",
  jsonLd: [
    generateArticleSchema({
      title: "${title}",
      description: "${description}",
      url: "${canonical}",
      datePublished: "${now}",
      dateModified: "${now}",
      keywords: ${JSON.stringify(keywords)},
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "${title}", url: "${canonical}" },
    ]),
    generateHowToSchema({
      name: "${title}",
      description: "${description}",
      totalTime: "PT20M",
      steps: [
        { name: "Set up HTML structure", text: "Create the base component container and elements" },
        { name: "Add interactivity", text: "Initialize state management and event handlers" },
        { name: "Style with Tailwind CSS", text: "Apply utility classes for responsive layout" },
        { name: "Add accessibility features", text: "Implement ARIA attributes and keyboard navigation" },
        { name: "Test the component", text: "Verify functionality across browsers and devices" },
      ],
    }),
  ],
};
`;

  // Find where to insert SEO config (before first const or at end)
  const firstConstIndex = newFrontmatter.indexOf("\nconst ");
  if (firstConstIndex > 0) {
    newFrontmatter =
      newFrontmatter.substring(0, firstConstIndex) +
      seoConfig +
      newFrontmatter.substring(firstConstIndex);
  } else {
    newFrontmatter = newFrontmatter + seoConfig;
  }

  // Replace frontmatter
  let newContent = content.replace(
    /^---\n[\s\S]*?\n---/,
    `---\n${newFrontmatter}\n---`
  );

  // Update BaseLayout call
  newContent = newContent.replace(
    /<BaseLayout(\s*)>/g,
    "<BaseLayout seo={seoConfig}>"
  );

  fs.writeFileSync(filePath, newContent, "utf-8");

  return { status: "updated", title };
}

console.log("\n🔧 Smart SEO Updater\n");

let updated = 0;

for (const page of pagesToUpdate) {
  const result = addSEOToPage(page);
  if (result.status === "updated") {
    console.log(`✅ ${page}`);
    updated++;
  } else if (result.status === "error") {
    console.log(`❌ ${page}: ${result.reason}`);
  }
}

console.log(`\n✨ Updated ${updated} pages\n`);
