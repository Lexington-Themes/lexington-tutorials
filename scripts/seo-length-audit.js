import { readFileSync, readdirSync, statSync } from "fs";
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

function checkSEOLengths() {
  const pagesDir = "src/pages";
  const pages = findAllPages(pagesDir);

  const issues = {
    longTitles: [],
    longDescriptions: [],
    missingH1: [],
  };

  let totalPages = 0;

  pages.forEach((filePath) => {
    totalPages++;
    const content = readFileSync(filePath, "utf-8");

    // Extract title from seoConfig
    const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
    const title = titleMatch ? titleMatch[1] : null;

    // Extract description from seoConfig
    const descMatch = content.match(/description:\s*["']([^"']+)["']/);
    const description = descMatch ? descMatch[1] : null;

    // Check for H1
    const hasH1 = content.includes("<h1") || content.includes("<h1>");

    // Check title length (max 60)
    if (title && title.length > 60) {
      issues.longTitles.push({
        file: filePath.replace("src/pages/", ""),
        title,
        length: title.length,
        overflow: title.length - 60,
      });
    }

    // Check description length (max 160)
    if (description && description.length > 160) {
      issues.longDescriptions.push({
        file: filePath.replace("src/pages/", ""),
        description,
        length: description.length,
        overflow: description.length - 160,
      });
    }

    // Check for H1
    if (!hasH1) {
      issues.missingH1.push({
        file: filePath.replace("src/pages/", ""),
      });
    }
  });

  console.log("\n📊 SEO Length Audit Results\n");
  console.log("=".repeat(80));

  // Title issues
  console.log(
    `\n📝 Title Issues (${issues.longTitles.length} pages with titles > 60 chars):`
  );
  if (issues.longTitles.length > 0) {
    issues.longTitles.forEach((issue) => {
      console.log(`\n❌ ${issue.file}`);
      console.log(
        `   Length: ${issue.length} chars (+${issue.overflow} over limit)`
      );
      console.log(`   Title: "${issue.title}"`);
    });
  } else {
    console.log("✅ All titles are within 60 characters!");
  }

  // Description issues
  console.log(
    `\n📄 Description Issues (${issues.longDescriptions.length} pages with descriptions > 160 chars):`
  );
  if (issues.longDescriptions.length > 0) {
    issues.longDescriptions.forEach((issue) => {
      console.log(`\n❌ ${issue.file}`);
      console.log(
        `   Length: ${issue.length} chars (+${issue.overflow} over limit)`
      );
      console.log(
        `   Description: "${issue.description.substring(0, 100)}..."`
      );
    });
  } else {
    console.log("✅ All descriptions are within 160 characters!");
  }

  // H1 issues
  console.log(
    `\n🔤 H1 Issues (${issues.missingH1.length} pages missing H1 tags):`
  );
  if (issues.missingH1.length > 0) {
    issues.missingH1.forEach((issue) => {
      console.log(`❌ ${issue.file}`);
    });
  } else {
    console.log("✅ All pages have H1 tags!");
  }

  // Summary
  console.log("\n" + "=".repeat(80));
  console.log("\n📊 Summary:");
  console.log(`Total pages: ${totalPages}`);
  console.log(`Pages with long titles (>60): ${issues.longTitles.length}`);
  console.log(
    `Pages with long descriptions (>160): ${issues.longDescriptions.length}`
  );
  console.log(`Pages missing H1: ${issues.missingH1.length}`);
  console.log(
    `Total issues: ${issues.longTitles.length + issues.longDescriptions.length + issues.missingH1.length}`
  );
  console.log("\n");
}

checkSEOLengths();
