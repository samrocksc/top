#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Path to the .env.local file
const envLocalPath = path.join(__dirname, "..", ".env.local");
const envExamplePath = path.join(__dirname, "..", ".env.example");

// Function to generate a random secret
function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

// Function to create or update .env.local with Auth0 configuration
function setupEnv() {
  console.log("Setting up client environment with Auth0 configuration...");

  // Check if .env.local already exists
  if (fs.existsSync(envLocalPath)) {
    console.log("✅ .env.local already exists");

    // Read the existing content
    const existingContent = fs.readFileSync(envLocalPath, "utf8");

    // Check if it contains actual Auth0 values or just placeholders
    const hasRealValues =
      !existingContent.includes("your-secret-value-here") &&
      !existingContent.includes("your-domain.auth0.com") &&
      !existingContent.includes("your-client-id-here") &&
      !existingContent.includes("your-client-secret-here");

    if (hasRealValues) {
      console.log("✅ Auth0 configuration appears to be already set up");
      return;
    } else {
      console.log(
        "💡 .env.local contains placeholder values. Please update with your actual Auth0 configuration:",
      );
      console.log(
        "   - AUTH0_SECRET: A random string (automatically generated if not set)",
      );
      console.log(
        "   - AUTH0_BASE_URL: http://localhost:3001 (default for local development)",
      );
      console.log("   - AUTH0_ISSUER_BASE_URL: Your Auth0 domain URL");
      console.log("   - AUTH0_CLIENT_ID: Your Auth0 application client ID");
      console.log(
        "   - AUTH0_CLIENT_SECRET: Your Auth0 application client secret",
      );

      // Generate a proper secret if it's still a placeholder
      if (existingContent.includes("your-secret-value-here")) {
        const secret = generateSecret();
        const updatedContent = existingContent.replace(
          "your-secret-value-here-at-least-32-characters-long",
          secret,
        );
        fs.writeFileSync(envLocalPath, updatedContent);
        console.log("✅ Generated a secure AUTH0_SECRET value");
      }
      return;
    }
  }

  // Read the .env.example file
  if (!fs.existsSync(envExamplePath)) {
    console.error("❌ .env.example file not found");
    process.exit(1);
  }

  const envExampleContent = fs.readFileSync(envExamplePath, "utf8");

  // Replace placeholder values with actual values or instructions
  const envLocalContent = envExampleContent
    .replace(
      "your-secret-value-here-at-least-32-characters-long",
      generateSecret(),
    )
    .replace("http://localhost:3001", "http://localhost:3001")
    .replace(
      "https://your-domain.auth0.com",
      "https://YOUR-AUTH0-DOMAIN.auth0.com",
    )
    .replace("your-client-id-here", "YOUR-AUTH0-CLIENT-ID")
    .replace("your-client-secret-here", "YOUR-AUTH0-CLIENT-SECRET");

  // Write the .env.local file
  fs.writeFileSync(envLocalPath, envLocalContent);

  console.log("✅ Created .env.local file with Auth0 configuration");
  console.log("\n📝 Next steps:");
  console.log("1. Update the Auth0 configuration values in .env.local:");
  console.log("   - AUTH0_ISSUER_BASE_URL: Your Auth0 domain URL");
  console.log("   - AUTH0_CLIENT_ID: Your Auth0 application client ID");
  console.log("   - AUTH0_CLIENT_SECRET: Your Auth0 application client secret");
  console.log("2. Start the client with: npm run dev");
}

// Run the setup
setupEnv();
