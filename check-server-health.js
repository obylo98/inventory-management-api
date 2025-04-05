const { connectDB, closeDB } = require("./db");

async function checkHealth() {
  try {
    console.log("Checking database connection...");
    const db = await connectDB();

    // Check if we can access the collections
    const productCount = await db.collection("products").countDocuments();
    const supplierCount = await db.collection("suppliers").countDocuments();

    console.log("\n SERVER HEALTH CHECK PASSED");
    console.log("-----------------------------");
    console.log(`Connected to MongoDB successfully`);
    console.log(`Found ${productCount} products in database`);
    console.log(`Found ${supplierCount} suppliers in database`);
    console.log("-----------------------------");
    console.log("Your server is ready to be deployed to Render!\n");

    return true;
  } catch (error) {
    console.error("\n SERVER HEALTH CHECK FAILED");
    console.error("-----------------------------");
    console.error("Error connecting to database:", error.message);
    console.error("-----------------------------");
    console.error(
      "Please check your MongoDB connection string and make sure your Atlas database is accessible.\n"
    );

    return false;
  } finally {
    await closeDB();
  }
}

// Run health check
checkHealth()
  .then((isHealthy) => {
    process.exit(isHealthy ? 0 : 1);
  })
  .catch((err) => {
    console.error("Unexpected error during health check:", err);
    process.exit(1);
  });
