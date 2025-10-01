#!/usr/bin/env node

/**
 * SEO Audit Script for Lexington Tutorials
 *
 * This script scans all page files and checks if they have proper SEO configuration.
 * Usage: node scripts/seo-audit.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.join(__dirname, "..", "src", "pages");

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function findAstroFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findAstroFiles(filePath, fileList);
    } else if (file.endsWith(".astro") && !file.startsWith("_")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function checkSEOInFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relativePath = path.relative(PAGES_DIR, filePath);

  const checks = {
    hasSeoConfig: /const\s+seoConfig\s*=/.test(content),
    hasTitle: /title:\s*["']/.test(content),
    hasDescription: /description:\s*["']/.test(content),
    hasCanonical: /canonical:\s*["']/.test(content),
    hasJsonLd: /jsonLd:\s*\[/.test(content),
    hasArticleSchema: /generateArticleSchema/.test(content),
    hasBreadcrumbSchema: /generateBreadcrumbSchema/.test(content),
    hasHowToSchema: /generateHowToSchema/.test(content),
    passesSeoToLayout: /<BaseLayout\s+seo=\{seoConfig\}/.test(content),
  };

  return {
    filePath: relativePath,
    ...checks,
  };
}

function main() {
  log("\n🔍 SEO Audit for Lexington Tutorials\n", "bold");
  log("Scanning pages directory...\n", "cyan");

  const astroFiles = findAstroFiles(PAGES_DIR);
  const results = astroFiles.map(checkSEOInFile);

  // Categorize results
  const fullyOptimized = results.filter(
    (r) =>
      r.hasSeoConfig &&
      r.hasTitle &&
      r.hasDescription &&
      r.hasCanonical &&
      r.hasJsonLd &&
      r.passesSeoToLayout
  );

  const partiallyOptimized = results.filter(
    (r) =>
      (r.hasTitle || r.hasDescription || r.hasCanonical) &&
      !fullyOptimized.includes(r)
  );

  const needsOptimization = results.filter(
    (r) => !fullyOptimized.includes(r) && !partiallyOptimized.includes(r)
  );

  // Display results
  log(`📊 Summary\n${"=".repeat(50)}`, "bold");
  log(`Total pages: ${results.length}`);
  log(`✅ Fully optimized: ${fullyOptimized.length}`, "green");
  log(`⚠️  Partially optimized: ${partiallyOptimized.length}`, "yellow");
  log(`❌ Needs optimization: ${needsOptimization.length}`, "red");

  if (fullyOptimized.length > 0) {
    log(`\n✅ Fully Optimized Pages (${fullyOptimized.length}):`, "green");
    fullyOptimized.forEach((page) => {
      log(`   • ${page.filePath}`, "green");
      if (page.hasArticleSchema) log(`     - Has Article schema`, "green");
      if (page.hasBreadcrumbSchema)
        log(`     - Has Breadcrumb schema`, "green");
      if (page.hasHowToSchema) log(`     - Has HowTo schema`, "green");
    });
  }

  if (partiallyOptimized.length > 0) {
    log(
      `\n⚠️  Partially Optimized Pages (${partiallyOptimized.length}):`,
      "yellow"
    );
    partiallyOptimized.forEach((page) => {
      log(`   • ${page.filePath}`, "yellow");
      if (!page.hasSeoConfig) log(`     - Missing: seoConfig`, "yellow");
      if (!page.hasTitle) log(`     - Missing: title`, "yellow");
      if (!page.hasDescription) log(`     - Missing: description`, "yellow");
      if (!page.hasCanonical) log(`     - Missing: canonical`, "yellow");
      if (!page.hasJsonLd) log(`     - Missing: jsonLd`, "yellow");
      if (!page.passesSeoToLayout)
        log(`     - Not passing seo to BaseLayout`, "yellow");
    });
  }

  if (needsOptimization.length > 0) {
    log(
      `\n❌ Pages Needing Optimization (${needsOptimization.length}):`,
      "red"
    );
    needsOptimization.forEach((page) => {
      log(`   • ${page.filePath}`, "red");
    });
  }

  log(`\n${"=".repeat(50)}`, "bold");
  log("\n💡 Tips:", "cyan");
  log("1. Copy src/pages/_template.astro for new pages");
  log("2. See SEO-GUIDE.md for detailed instructions");
  log("3. Use the JSON-LD utilities in src/utils/jsonLd.ts");
  log("4. Test with Google Rich Results Test after deploying\n");

  // Exit with error code if there are pages needing optimization
  if (needsOptimization.length > 0) {
    process.exit(1);
  }
}

main();
