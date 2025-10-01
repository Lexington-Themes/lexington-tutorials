#!/usr/bin/env node

/**
 * Batch SEO Updater
 *
 * Automatically adds SEO configuration to pages that don't have it.
 * This script analyzes each page and generates appropriate SEO config.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, "..", "src", "pages");
const DRY_RUN = process.argv.includes("--dry-run");

// Component type detection and metadata
const COMPONENT_METADATA = {
  modal: {
    type: "Modal Dialog",
    action: "Create a Modal Dialog",
    features: ["keyboard navigation", "focus management", "backdrop overlay"],
    time: "PT25M",
  },
  accordion: {
    type: "Accordion",
    action: "Create an Accordion",
    features: ["smooth animations", "accessible markup", "expandable sections"],
    time: "PT15M",
  },
  carousel: {
    type: "Carousel",
    action: "Create a Carousel",
    features: ["smooth scrolling", "navigation controls", "touch support"],
    time: "PT20M",
  },
  tabs: {
    type: "Tabs",
    action: "Create Tabs",
    features: ["keyboard navigation", "persistent state", "smooth transitions"],
    time: "PT15M",
  },
  dropdown: {
    type: "Dropdown",
    action: "Create a Dropdown",
    features: [
      "keyboard navigation",
      "accessibility support",
      "smooth animations",
    ],
    time: "PT15M",
  },
  tooltip: {
    type: "Tooltip",
    action: "Create Tooltips",
    features: ["hover effects", "positioning", "smooth animations"],
    time: "PT10M",
  },
  form: {
    type: "Form",
    action: "Build a Form",
    features: ["validation", "error handling", "responsive design"],
    time: "PT20M",
  },
  table: {
    type: "Table",
    action: "Create a Responsive Table",
    features: ["responsive design", "sorting", "filtering"],
    time: "PT20M",
  },
  card: {
    type: "Card",
    action: "Create Cards",
    features: ["hover effects", "responsive layout", "modern design"],
    time: "PT15M",
  },
  button: {
    type: "Button",
    action: "Create Buttons",
    features: ["hover effects", "variants", "accessibility"],
    time: "PT10M",
  },
  navigation: {
    type: "Navigation",
    action: "Create Navigation",
    features: ["responsive design", "mobile menu", "smooth scrolling"],
    time: "PT20M",
  },
  sidebar: {
    type: "Sidebar",
    action: "Create a Sidebar",
    features: ["slide animations", "responsive design", "overlay backdrop"],
    time: "PT20M",
  },
  drawer: {
    type: "Drawer",
    action: "Create a Drawer",
    features: ["slide animations", "backdrop overlay", "accessibility"],
    time: "PT20M",
  },
  menu: {
    type: "Menu",
    action: "Create a Menu",
    features: ["dropdown functionality", "keyboard navigation", "positioning"],
    time: "PT15M",
  },
  search: {
    type: "Search",
    action: "Create a Search Component",
    features: ["live filtering", "responsive design", "keyboard shortcuts"],
    time: "PT20M",
  },
  gallery: {
    type: "Gallery",
    action: "Create an Image Gallery",
    features: ["responsive grid", "lightbox", "lazy loading"],
    time: "PT25M",
  },
  slider: {
    type: "Slider",
    action: "Create a Slider",
    features: ["drag functionality", "range selection", "custom styling"],
    time: "PT20M",
  },
  toggle: {
    type: "Toggle",
    action: "Create a Toggle",
    features: ["smooth animations", "state management", "accessibility"],
    time: "PT10M",
  },
  animation: {
    type: "Animation",
    action: "Create Animations",
    features: ["CSS transitions", "keyframes", "performance optimization"],
    time: "PT15M",
  },
  calendar: {
    type: "Calendar",
    action: "Create a Calendar",
    features: ["date selection", "event display", "responsive design"],
    time: "PT30M",
  },
  cart: {
    type: "Shopping Cart",
    action: "Create a Shopping Cart",
    features: ["item management", "quantity controls", "total calculation"],
    time: "PT25M",
  },
  countdown: {
    type: "Countdown Timer",
    action: "Create a Countdown Timer",
    features: ["real-time updates", "custom formatting", "completion events"],
    time: "PT15M",
  },
  todo: {
    type: "Todo List",
    action: "Create a Todo List",
    features: ["add/remove items", "mark complete", "local storage"],
    time: "PT20M",
  },
  pricing: {
    type: "Pricing Table",
    action: "Create a Pricing Table",
    features: ["responsive layout", "feature comparison", "CTA buttons"],
    time: "PT20M",
  },
  banner: {
    type: "Banner",
    action: "Create a Banner",
    features: ["dismissible", "animations", "positioning"],
    time: "PT10M",
  },
  progress: {
    type: "Progress Bar",
    action: "Create a Progress Bar",
    features: ["animated progress", "percentage display", "custom styling"],
    time: "PT15M",
  },
};

function detectComponentType(folderName, content) {
  const lowerName = folderName.toLowerCase();

  // Check for direct matches
  for (const [key, metadata] of Object.entries(COMPONENT_METADATA)) {
    if (lowerName.includes(key)) {
      return metadata;
    }
  }

  // Fallback based on common patterns
  if (lowerName.includes("step")) {
    return {
      type: "Multi-Step Form",
      action: "Create a Multi-Step Form",
      features: ["progress tracking", "validation", "smooth transitions"],
      time: "PT25M",
    };
  }
  if (lowerName.includes("auth")) {
    return {
      type: "Authentication Form",
      action: "Create an Authentication Form",
      features: ["validation", "error handling", "responsive design"],
      time: "PT20M",
    };
  }
  if (lowerName.includes("rating")) {
    return {
      type: "Rating System",
      action: "Create a Rating System",
      features: ["star display", "interactive selection", "hover effects"],
      time: "PT15M",
    };
  }
  if (lowerName.includes("tag")) {
    return {
      type: "Tag Input",
      action: "Create a Tag Input",
      features: ["add/remove tags", "keyboard support", "custom styling"],
      time: "PT20M",
    };
  }
  if (lowerName.includes("password")) {
    return {
      type: "Password Strength Meter",
      action: "Create a Password Strength Meter",
      features: [
        "strength calculation",
        "visual feedback",
        "real-time updates",
      ],
      time: "PT15M",
    };
  }
  if (lowerName.includes("html-")) {
    const tagName = lowerName.replace("html-", "").replace("-tag", "");
    return {
      type: `HTML ${tagName.toUpperCase()} Tag`,
      action: `Use the HTML ${tagName.toUpperCase()} Tag`,
      features: ["semantic HTML", "accessibility", "browser support"],
      time: "PT10M",
    };
  }

  // Generic fallback
  const displayName = folderName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    type: displayName,
    action: `Create ${displayName}`,
    features: ["responsive design", "modern styling", "accessibility"],
    time: "PT20M",
  };
}

function detectFramework(content) {
  const hasAlpine = /x-data|x-show|x-if|alpine/i.test(content);
  const hasVanillaJS =
    /addEventListener|querySelector|getElementById/i.test(content) &&
    !hasAlpine;

  if (hasAlpine) return "Alpine.js";
  if (hasVanillaJS) return "JavaScript";
  return "Tailwind CSS";
}

function generateKeywords(componentType, framework, folderName) {
  const keywords = ["Tailwind CSS"];

  if (framework === "Alpine.js") keywords.push("Alpine.js");
  if (framework === "JavaScript") keywords.push("JavaScript", "Vanilla JS");

  keywords.push(componentType.type);
  keywords.push("Tutorial");
  keywords.push("Web Development");

  if (folderName.includes("animated")) keywords.push("Animation");
  if (folderName.includes("responsive")) keywords.push("Responsive Design");
  if (folderName.includes("3d") || folderName.includes("three-d"))
    keywords.push("3D Effects");

  return [...new Set(keywords)].slice(0, 7);
}

function generateSEOConfig(folderName, content, canonical) {
  const componentType = detectComponentType(folderName, content);
  const framework = detectFramework(content);
  const keywords = generateKeywords(componentType, framework, folderName);

  const title = `How to ${componentType.action} with ${framework} and Tailwind CSS`;
  const shortTitle =
    title.length > 60 ? `${componentType.action} with ${framework}` : title;

  const description = `Learn to build ${componentType.type.toLowerCase()} components using ${framework} and Tailwind CSS. Includes ${componentType.features.slice(0, 2).join(" and ")}.`;
  const shortDescription =
    description.length > 160
      ? description.substring(0, 157) + "..."
      : description;

  const steps = [
    {
      name: "Set up HTML structure",
      text: `Create the base ${componentType.type.toLowerCase()} container and elements`,
    },
    {
      name: `Add ${framework} interactivity`,
      text: `Initialize ${framework} to handle component state and interactions`,
    },
    {
      name: "Style with Tailwind CSS",
      text: "Apply utility classes for responsive layout and modern design",
    },
    {
      name: "Add accessibility features",
      text: "Implement ARIA attributes and keyboard navigation",
    },
    {
      name: "Test the component",
      text: "Verify functionality across different browsers and devices",
    },
  ];

  const now = new Date().toISOString();

  return {
    title: shortTitle,
    description: shortDescription,
    canonical,
    keywords,
    steps,
    time: componentType.time,
    datePublished: now,
  };
}

function hasExistingSEO(content) {
  return (
    /const\s+seoConfig\s*=/i.test(content) ||
    /<BaseLayout\s+seo=/i.test(content)
  );
}

function generateSEOBlock(config, folderName) {
  return `---
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
  title: "${config.title}",
  description: "${config.description}",
  canonical: "${config.canonical}",
  jsonLd: [
    generateArticleSchema({
      title: "${config.title}",
      description: "${config.description}",
      url: "${config.canonical}",
      datePublished: "${config.datePublished}",
      dateModified: "${config.datePublished}",
      keywords: ${JSON.stringify(config.keywords)},
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "${config.title.replace(/"/g, '\\"')}", url: "${config.canonical}" },
    ]),
    generateHowToSchema({
      name: "${config.title}",
      description: "${config.description}",
      totalTime: "${config.time}",
      steps: ${JSON.stringify(config.steps, null, 6).replace(/\n/g, "\n      ")},
    }),
  ],
};
`;
}

function updatePageFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  if (hasExistingSEO(content)) {
    return { status: "skipped", reason: "Already has SEO" };
  }

  const pathParts = filePath.split("/");
  const folderName = pathParts[pathParts.length - 2];
  const canonical = `/${folderName}`;

  const config = generateSEOConfig(folderName, content, canonical);
  const seoBlock = generateSEOBlock(config, folderName);

  // Find the frontmatter section
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    return { status: "error", reason: "No frontmatter found" };
  }

  const existingFrontmatter = frontmatterMatch[1];
  const newContent = content.replace(/^---\n[\s\S]*?\n---/, seoBlock + "---");

  // Update BaseLayout call
  const finalContent = newContent.replace(
    /<BaseLayout(\s*)>/g,
    "<BaseLayout seo={seoConfig}>"
  );

  if (!DRY_RUN) {
    fs.writeFileSync(filePath, finalContent, "utf-8");
  }

  return { status: "updated", title: config.title };
}

function processPages() {
  const results = {
    updated: [],
    skipped: [],
    errors: [],
  };

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanDirectory(itemPath);
      } else if (item === "index.astro" && !itemPath.includes("_template")) {
        const relativePath = path.relative(PAGES_DIR, itemPath);

        // Skip already optimized pages
        if (
          relativePath === "index.astro" ||
          relativePath === "accordion/index.astro" ||
          relativePath === "carousel/index.astro"
        ) {
          continue;
        }

        const result = updatePageFile(itemPath);

        if (result.status === "updated") {
          results.updated.push({ path: relativePath, title: result.title });
        } else if (result.status === "skipped") {
          results.skipped.push({ path: relativePath, reason: result.reason });
        } else if (result.status === "error") {
          results.errors.push({ path: relativePath, reason: result.reason });
        }
      }
    }
  }

  scanDirectory(PAGES_DIR);
  return results;
}

// Main execution
console.log("\n🚀 Batch SEO Updater\n");
console.log(
  DRY_RUN
    ? "🔍 DRY RUN MODE - No files will be modified\n"
    : "✏️  LIVE MODE - Files will be updated\n"
);

const results = processPages();

console.log("📊 Results:\n");
console.log(`✅ Updated: ${results.updated.length} pages`);
console.log(`⏭️  Skipped: ${results.skipped.length} pages`);
console.log(`❌ Errors: ${results.errors.length} pages\n`);

if (results.updated.length > 0) {
  console.log("✅ Updated Pages:");
  results.updated.slice(0, 10).forEach(({ path, title }) => {
    console.log(`   • ${path}`);
    console.log(`     "${title}"`);
  });
  if (results.updated.length > 10) {
    console.log(`   ... and ${results.updated.length - 10} more`);
  }
  console.log();
}

if (results.errors.length > 0) {
  console.log("❌ Errors:");
  results.errors.forEach(({ path, reason }) => {
    console.log(`   • ${path}: ${reason}`);
  });
  console.log();
}

if (DRY_RUN) {
  console.log("💡 To apply changes, run without --dry-run flag\n");
} else {
  console.log("✨ Done! Run `npm run seo:audit` to verify\n");
}
