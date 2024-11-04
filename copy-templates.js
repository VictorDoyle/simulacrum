// temporary work around to bypass tsc
const fs = require("fs-extra");
const path = require("path");

async function copyTemplates() {
  try {
    const src = path.join(__dirname, "src", "templates");
    const dest = path.join(__dirname, "dist", "templates");
    await fs.copy(src, dest);
    console.log("Templates copied successfully.");
  } catch (err) {
    console.error("Error copying templates:", err);
    process.exit(1);
  }
}

copyTemplates();
