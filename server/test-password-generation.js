// Test script to verify the password generation function
import { generateRandomPassword } from "./utils/emailService.js";

console.log("Testing password generation...");

// Test password generation
for (let i = 0; i < 10; i++) {
  const password = generateRandomPassword();
  console.log(`Generated password ${i + 1}: ${password}`);

  // Verify password requirements
  if (password.length !== 10) {
    console.error(
      `❌ Password ${i + 1} length is ${password.length}, should be 10`
    );
  } else {
    console.log(`✅ Password ${i + 1} length is correct (10 characters)`);
  }

  // Check if password contains only letters (no numbers or special characters)
  const onlyLetters = /^[a-zA-Z]+$/.test(password);
  if (!onlyLetters) {
    console.error(`❌ Password ${i + 1} contains non-letter characters`);
  } else {
    console.log(`✅ Password ${i + 1} contains only letters`);
  }

  console.log("---");
}

console.log("Password generation test completed!");
