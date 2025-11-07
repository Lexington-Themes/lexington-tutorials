#!/usr/bin/env node

/**
 * SEO Migration Helper
 *
 * Generates SEO configuration suggestions based on page file names and content.
 * Usage: node scripts/generate-seo-config.js [page-path]
 *
 * Example: node scripts/generate-seo-config.js src/pages/modal/index
 */

import fs from "fs";

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: node scripts/generate-seo-config.js <page-path>");
  console.log(
    "Example: node scripts/generate-seo-config.js src/pages/modal/index"
  );
  process.exit(1);
}

const filePath = args[0];

if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found: ${filePath}`);
  process.exit(1);
}

// Extract page info from path
const pathParts = filePath.split("/");
const pageFolder = pathParts[pathParts.length - 2];
const pageName = pageFolder
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

// Read file content to detect framework
const content = fs.readFileSync(filePath, "utf-8");
const hasAlpine = content.includes("alpine") || content.includes("x-data");
const hasJavaScript =
  content.includes("javascript") || content.includes("<script");
const hasAstro = content.includes("astro") || filePath.includes("astro");

// Detect component type
const componentTypes = {
  modal: { type: "Modal", action: "Create a Modal Dialog" },
  carousel: { type: "Carousel", action: "Create a Carousel" },
  accordion: { type: "Accordion", action: "Create an Accordion" },
  tabs: { type: "Tabs", action: "Create Tabs" },
  dropdown: { type: "Dropdown", action: "Create a Dropdown" },
  tooltip: { type: "Tooltip", action: "Create a Tooltip" },
  form: { type: "Form", action: "Build a Form" },
  table: { type: "Table", action: "Create a Table" },
  card: { type: "Card", action: "Create Cards" },
  button: { type: "Button", action: "Create Buttons" },
  navigation: { type: "Navigation", action: "Create Navigation" },
  sidebar: { type: "Sidebar", action: "Create a Sidebar" },
  footer: { type: "Footer", action: "Create a Footer" },
  header: { type: "Header", action: "Create a Header" },
  drawer: { type: "Drawer", action: "Create a Drawer" },
  menu: { type: "Menu", action: "Create a Menu" },
  search: { type: "Search", action: "Create a Search Component" },
  gallery: { type: "Gallery", action: "Create a Gallery" },
  slider: { type: "Slider", action: "Create a Slider" },
  toggle: { type: "Toggle", action: "Create a Toggle" },
  animation: { type: "Animation", action: "Create Animations" },
};

let componentInfo = { type: pageName, action: `Create ${pageName}` };
for (const [key, value] of Object.entries(componentTypes)) {
  if (pageFolder.toLowerCase().includes(key)) {
    componentInfo = value;
    break;
  }
}

// Determine frameworks
const frameworks = [];
if (hasAlpine) frameworks.push("Alpine.js");
if (hasJavaScript && !hasAlpine) frameworks.push("JavaScript");
if (hasAstro) frameworks.push("Astro");
frameworks.push("Tailwind CSS");

const frameworkStr = frameworks.slice(0, 2).join(" and ");

// Generate title
const title = `How to ${componentInfo.action} with ${frameworkStr}`;

// Generate description
const features = [
  "responsive design",
  "smooth animations",
  "accessibility features",
];
const description = `Learn to build ${componentInfo.type.toLowerCase()} components using ${frameworkStr}. Includes ${features
  .slice(0, 2)
  .join(" and ")}.`;

// Generate keywords
const keywords = [
  frameworkStr.split(" and ")[0],
  componentInfo.type,
  "Tutorial",
  "Web Development",
];
if (hasAlpine) keywords.push("Alpine.js");
if (hasJavaScript) keywords.push("JavaScript");
keywords.push("Tailwind CSS");

// Generate canonical URL
const canonical = `/${pageFolder}`;

// Get current date
const now = new Date();
const datePublished = now.toISOString();

// Generate steps
const steps = [
  {
    name: "Set up the HTML structure",
    text: `Create the basic ${componentInfo.type.toLowerCase()} container and elements`,
  },
  {
    name: "Add state management",
    text: `Initialize ${frameworks[0]} to handle component state`,
  },
  {
    name: "Style with Tailwind CSS",
    text: "Apply utility classes for layout and appearance",
  },
  {
    name: "Add interactivity",
    text: "Implement event handlers and user interactions",
  },
  {
    name: "Test the component",
    text: "Verify functionality and accessibility",
  },
];

// Generate the SEO config
const seoConfig = `---
import BaseLayout from "@/layouts/BaseLayout.astro";
import Wrapper from "@/components/fundations/containers/Wrapper.astro";
import TutorialBanner from "@/components/global/TutorialBanner.astro";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateHowToSchema,
} from "@/utils/jsonLd";

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
      datePublished: "${datePublished}",
      dateModified: "${datePublished}",
      keywords: ${JSON.stringify(keywords)},
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "${pageName} Tutorial", url: "${canonical}" },
    ]),
    generateHowToSchema({
      name: "${componentInfo.action} with ${frameworkStr}",
      description: "Step-by-step guide to building ${componentInfo.type.toLowerCase()} components",
      totalTime: "PT20M",
      steps: ${JSON.stringify(steps, null, 8).replace(/\n/g, "\n      ")},
    }),
  ],
};
---

<BaseLayout seo={seoConfig}>
  <section>
    <TutorialBanner
      tutorialUrl="https://lexingtonthemes.com/tutorials/[UPDATE-THIS]"
      codeUrl="https://github.com/Lexington-Themes/lexington-tutorials/blob/main/${filePath}"
    />
    <Wrapper class="py-24 lg:py-48">
      <!-- Your existing content goes here -->
    </Wrapper>
  </section>
</BaseLayout>`;

console.log("\n📝 Generated SEO Configuration\n");
console.log("Copy this to the top of your file:");
console.log(
  "═══════════════════════════════════════════════════════════════\n"
);
console.log(seoConfig);
console.log(
  "\n═══════════════════════════════════════════════════════════════\n"
);

console.log("✏️  Review and adjust:");
console.log(`   • Title: "${title}"`);
console.log(`   • Description: "${description}"`);
console.log(`   • Keywords: ${keywords.join(", ")}`);
console.log(`   • Canonical: "${canonical}"`);
console.log(`   • Update TutorialBanner URL\n`);

console.log("💡 Tips:");
console.log("   • Adjust title if it's too generic");
console.log("   • Customize description with specific features");
console.log("   • Add/remove keywords as needed");
console.log("   • Update HowTo steps to match your actual tutorial");
console.log("   • Set accurate time estimate (PT20M = 20 minutes)\n");
