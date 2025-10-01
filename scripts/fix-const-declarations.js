#!/usr/bin/env node

/**
 * Fix pages that had existing const declarations removed by batch update
 */

import { execSync } from "child_process";
import fs from "fs";

const pages = [
  "adaptable-navigation",
  "alpine-sidebar",
  "alpine-testimonial",
  "animated-avatar-widget",
  "animated-blog-cards",
  "animated-images",
  "count-down",
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

console.log("🔧 Fixing pages with missing const declarations...\n");

let fixed = 0;

for (const page of pages) {
  try {
    const filePath = `src/pages/${page}/index.astro`;

    // Get original const declarations from git
    const originalContent = execSync(`git show HEAD:${filePath}`, {
      encoding: "utf-8",
    });
    const currentContent = fs.readFileSync(filePath, "utf-8");

    // Extract const declarations from original (everything between --- and ---, excluding imports and seoConfig)
    const originalFrontmatterMatch = originalContent.match(
      /^---\n([\s\S]*?)\n---/
    );
    if (!originalFrontmatterMatch) continue;

    const originalFrontmatter = originalFrontmatterMatch[1];

    // Extract const declarations (lines that start with 'const' and aren't seoConfig)
    const constLines = [];
    const lines = originalFrontmatter.split("\n");
    let inMultiline = false;
    let currentConst = [];

    for (const line of lines) {
      if (line.trim().startsWith("const ") && !line.includes("seoConfig")) {
        inMultiline = true;
        currentConst = [line];
      } else if (inMultiline) {
        currentConst.push(line);
        if (line.includes("];") || line.includes("};")) {
          constLines.push(currentConst.join("\n"));
          inMultiline = false;
          currentConst = [];
        }
      }
    }

    if (constLines.length === 0) continue;

    // Insert const declarations after seoConfig in current file
    const constBlock = "\n\n" + constLines.join("\n\n");
    const updated = currentContent.replace(
      /(const seoConfig = \{[\s\S]*?\n\};\n)/,
      `$1${constBlock}\n`
    );

    if (updated !== currentContent) {
      fs.writeFileSync(filePath, updated, "utf-8");
      console.log(`✅ Fixed: ${filePath}`);
      fixed++;
    }
  } catch (error) {
    console.log(`⚠️  Skipped ${page}: ${error.message}`);
  }
}

console.log(`\n✨ Fixed ${fixed} pages`);
