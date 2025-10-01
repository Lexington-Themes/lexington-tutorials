import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

function findAllPages(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      findAllPages(filePath, fileList);
    } else if (file === "index.astro" && !filePath.includes("_template")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function addH1ToPage(filePath) {
  let content = readFileSync(filePath, "utf-8");

  // Check if already has H1
  if (content.includes("<h1") || content.includes("<h1>")) {
    return { updated: false, reason: "Already has H1" };
  }

  // Extract title from seoConfig
  const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
  if (!titleMatch) {
    return { updated: false, reason: "No title found in seoConfig" };
  }

  const title = titleMatch[1];

  // Create H1 with proper Tailwind styling
  const h1Tag = `  <h1 class="sr-only">${title}</h1>\n`;

  // Find where to insert the H1 (after opening <section> or <main> tag)
  // Look for the first <section or <main after the frontmatter
  const frontmatterEnd = content.indexOf("---", 3) + 3;
  const afterFrontmatter = content.substring(frontmatterEnd);

  // Try to find opening section tag
  let sectionMatch = afterFrontmatter.match(/(<section[^>]*>)/);
  if (!sectionMatch) {
    // Try main tag
    sectionMatch = afterFrontmatter.match(/(<main[^>]*>)/);
  }

  if (!sectionMatch) {
    // Try div with class container or similar
    sectionMatch = afterFrontmatter.match(
      /(<div[^>]*class="[^"]*(?:container|wrapper|content)[^"]*"[^>]*>)/
    );
  }

  if (!sectionMatch) {
    return { updated: false, reason: "Could not find insertion point" };
  }

  const sectionTag = sectionMatch[1];
  const sectionIndex =
    content.indexOf(sectionTag, frontmatterEnd) + sectionTag.length;

  // Insert H1 after the opening tag
  const updatedContent =
    content.substring(0, sectionIndex) +
    "\n" +
    h1Tag +
    content.substring(sectionIndex);

  writeFileSync(filePath, updatedContent);
  return { updated: true, title };
}

function main() {
  const pagesDir = "src/pages";
  const pages = findAllPages(pagesDir);

  console.log("\n🔤 Adding H1 Tags to Pages\n");
  console.log("=".repeat(80));

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  pages.forEach((filePath) => {
    const result = addH1ToPage(filePath);
    const fileName = filePath.replace("src/pages/", "");

    if (result.updated) {
      console.log(`✅ ${fileName}`);
      console.log(`   Added: <h1 class="sr-only">${result.title}</h1>`);
      updated++;
    } else if (result.reason === "Already has H1") {
      skipped++;
    } else {
      console.log(`⚠️  ${fileName} - ${result.reason}`);
      failed++;
    }
  });

  console.log("\n" + "=".repeat(80));
  console.log("\n📊 Summary:");
  console.log(`Total pages: ${pages.length}`);
  console.log(`✅ H1 tags added: ${updated}`);
  console.log(`⏭️  Skipped (already has H1): ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log("\n");
}

main();
