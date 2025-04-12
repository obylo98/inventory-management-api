/**
 * This script generates the swagger.json file for API documentation
 * Run this script manually when you make changes to the API
 */

const { generateSwaggerFile } = require("./swagger");

console.log("Generating swagger.json file...");
generateSwaggerFile()
  .then(() => {
    console.log(
      "Done! You can now start the server with the updated documentation."
    );
  })
  .catch((err) => {
    console.error("Error generating swagger.json:", err);
    process.exit(1);
  });
