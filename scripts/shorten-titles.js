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

function shortenTitle(title) {
  // If already 60 chars or less, return as-is
  if (title.length <= 60) {
    return title;
  }

  // Remove redundant words to shorten
  let shortened = title;

  // Replace "How to Create" with "Create" (saves 7 chars)
  shortened = shortened.replace(/^How to Create /, "Create ");

  // Replace "How to Build" with "Build" (saves 7 chars)
  shortened = shortened.replace(/^How to Build /, "Build ");

  // Replace "Learn to build" with "Build" (saves 9 chars)
  shortened = shortened.replace(/^Learn to build /, "Build ");

  // Replace " with Tailwind CSS and Alpine.js" with " - Alpine.js" (saves chars)
  shortened = shortened.replace(
    / with Alpine\.js and Tailwind CSS$/,
    " - Alpine.js"
  );
  shortened = shortened.replace(
    / with Tailwind CSS and Alpine\.js$/,
    " - Alpine.js"
  );

  // Replace " with JavaScript and Tailwind CSS" with " - JavaScript"
  shortened = shortened.replace(
    / with JavaScript and Tailwind CSS$/,
    " - JavaScript"
  );
  shortened = shortened.replace(
    / with Tailwind CSS and JavaScript$/,
    " - JavaScript"
  );

  // Replace " using Alpine.js and Tailwind CSS" with " - Alpine.js"
  shortened = shortened.replace(
    / using Alpine\.js and Tailwind CSS$/,
    " - Alpine.js"
  );

  // Replace " using JavaScript and Tailwind CSS" with " - JavaScript"
  shortened = shortened.replace(
    / using JavaScript and Tailwind CSS$/,
    " - JavaScript"
  );

  // Replace " with Tailwind CSS and Tailwind CSS" with " - Tailwind"
  shortened = shortened.replace(
    / with Tailwind CSS and Tailwind CSS$/,
    " - Tailwind"
  );

  // Replace " with Alpine.js" at the end
  shortened = shortened.replace(/ with Alpine\.js$/, " - Alpine.js");

  // Replace " with JavaScript" at the end
  shortened = shortened.replace(/ with JavaScript$/, " - JavaScript");

  // Replace " with Tailwind CSS" at the end
  shortened = shortened.replace(/ with Tailwind CSS$/, " - Tailwind");

  // Replace "components" with "component" (singular)
  shortened = shortened.replace(/ components /, " component ");

  // Remove "Learn to build" entirely if still too long
  shortened = shortened.replace(/^Learn to build /, "");

  // If still too long, try more aggressive shortening
  if (shortened.length > 60) {
    // Remove article words
    shortened = shortened.replace(/ a /g, " ");
    shortened = shortened.replace(/ an /g, " ");
    shortened = shortened.replace(/ the /g, " ");
  }

  // If STILL too long, truncate (last resort)
  if (shortened.length > 60) {
    // Try to cut at a word boundary
    shortened = shortened.substring(0, 57).trim() + "...";
  }

  return shortened;
}

function updatePageTitle(filePath) {
  let content = readFileSync(filePath, "utf-8");

  // Extract current title
  const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
  if (!titleMatch) {
    return { updated: false, reason: "No title found" };
  }

  const currentTitle = titleMatch[1];

  // Check if already 60 chars or less
  if (currentTitle.length <= 60) {
    return {
      updated: false,
      reason: "Already ≤60 chars",
      length: currentTitle.length,
    };
  }

  const newTitle = shortenTitle(currentTitle);

  // Replace in content
  const oldTitleLine = `title: "${currentTitle}",`;
  const newTitleLine = `title: "${newTitle}",`;

  const updatedContent = content.replace(oldTitleLine, newTitleLine);

  if (updatedContent === content) {
    return { updated: false, reason: "Could not replace title" };
  }

  writeFileSync(filePath, updatedContent);

  return {
    updated: true,
    oldTitle: currentTitle,
    newTitle: newTitle,
    oldLength: currentTitle.length,
    newLength: newTitle.length,
    saved: currentTitle.length - newTitle.length,
  };
}

function main() {
  const pagesDir = "src/pages";
  const pages = findAllPages(pagesDir);

  console.log("\n✂️  Shortening Meta Titles to 60 Characters\n");
  console.log("=".repeat(80));

  let updated = 0;
  let alreadyShort = 0;
  let failed = 0;

  const updates = [];

  pages.forEach((filePath) => {
    const result = updatePageTitle(filePath);
    const fileName = filePath.replace("src/pages/", "");

    if (result.updated) {
      console.log(`\n✅ ${fileName}`);
      console.log(`   Old (${result.oldLength} chars): "${result.oldTitle}"`);
      console.log(`   New (${result.newLength} chars): "${result.newTitle}"`);
      console.log(`   Saved: ${result.saved} characters`);
      updated++;
      updates.push(result);
    } else if (result.reason === "Already ≤60 chars") {
      alreadyShort++;
    } else {
      console.log(`❌ ${fileName} - ${result.reason}`);
      failed++;
    }
  });

  console.log("\n" + "=".repeat(80));
  console.log("\n📊 Summary:");
  console.log(`Total pages: ${pages.length}`);
  console.log(`✅ Titles shortened: ${updated}`);
  console.log(`⏭️  Already short enough: ${alreadyShort}`);
  console.log(`❌ Failed: ${failed}`);

  if (updates.length > 0) {
    const avgSaved = Math.round(
      updates.reduce((sum, u) => sum + u.saved, 0) / updates.length
    );
    console.log(`📉 Average characters saved: ${avgSaved}`);
  }

  console.log("\n");
}

main();
