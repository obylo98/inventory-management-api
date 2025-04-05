const { connectDB, closeDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");

// Sample supplier data
const sampleSuppliers = [
  {
    name: "TechSupplies Inc.",
    contactName: "John Smith",
    email: "john.smith@techsupplies.com",
    phone: "555-123-4567",
    address: {
      street: "123 Tech Blvd",
      city: "San Francisco",
      state: "CA",
      zipCode: "94107",
    },
    country: "USA",
    supplierType: "manufacturer",
    paymentTerms: "Net 30",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: "GlobalParts Ltd.",
    contactName: "Emma Johnson",
    email: "emma@globalparts.com",
    phone: "555-234-5678",
    address: {
      street: "456 Global Ave",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    country: "USA",
    supplierType: "distributor",
    paymentTerms: "Net 45",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: "ElectroComp Systems",
    contactName: "Michael Chang",
    email: "michael@electrocomp.com",
    phone: "555-345-6789",
    address: {
      street: "789 Circuit St",
      city: "Boston",
      state: "MA",
      zipCode: "02110",
    },
    country: "USA",
    supplierType: "manufacturer",
    paymentTerms: "Net 60",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Quality Hardware",
    contactName: "Sarah Wilson",
    email: "sarah@qualityhardware.com",
    phone: "555-456-7890",
    address: {
      street: "101 Quality Rd",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
    },
    country: "USA",
    supplierType: "wholesaler",
    paymentTerms: "Net 30",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: "JapanTech Co.",
    contactName: "Takeshi Yamamoto",
    email: "takeshi@japantech.co.jp",
    phone: "+81-3-1234-5678",
    address: {
      street: "2-1 Marunouchi",
      city: "Tokyo",
      state: "Tokyo",
      zipCode: "100-0005",
    },
    country: "Japan",
    supplierType: "manufacturer",
    paymentTerms: "Net 60",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: "EuroComponents GmbH",
    contactName: "Klaus Müller",
    email: "klaus@eurocomponents.de",
    phone: "+49-30-1234567",
    address: {
      street: "Hauptstrasse 25",
      city: "Berlin",
      state: "Berlin",
      zipCode: "10115",
    },
    country: "Germany",
    supplierType: "wholesaler",
    paymentTerms: "Net 45",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: "RapidSupply Group",
    contactName: "David Brown",
    email: "david@rapidsupply.com",
    phone: "555-567-8901",
    address: {
      street: "222 Fast Lane",
      city: "Atlanta",
      state: "GA",
      zipCode: "30303",
    },
    country: "USA",
    supplierType: "distributor",
    paymentTerms: "Net 15",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: "GreenTech Solutions",
    contactName: "Linda Green",
    email: "linda@greentech.com",
    phone: "555-678-9012",
    address: {
      street: "333 Eco Drive",
      city: "Portland",
      state: "OR",
      zipCode: "97205",
    },
    country: "USA",
    supplierType: "manufacturer",
    paymentTerms: "Net 30",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: "BudgetParts Inc.",
    contactName: "Robert Chen",
    email: "robert@budgetparts.com",
    phone: "555-789-0123",
    address: {
      street: "444 Value St",
      city: "Dallas",
      state: "TX",
      zipCode: "75201",
    },
    country: "USA",
    supplierType: "retailer",
    paymentTerms: "Net 30",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: "PremiumTech Ltd.",
    contactName: "Alexandra Lee",
    email: "alex@premiumtech.com",
    phone: "555-890-1234",
    address: {
      street: "555 Luxury Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
    },
    country: "USA",
    supplierType: "manufacturer",
    paymentTerms: "Net 60",
    isActive: false,
    createdAt: new Date().toISOString(),
  },
];

// Function to populate products after suppliers are created
async function populateProducts(supplierIds) {
  const sampleProducts = [
    {
      name: "High-Performance Laptop",
      description: "15-inch laptop with the latest processor and 16GB RAM",
      price: 1299.99,
      stock: 45,
      category: "Electronics",
      tags: ["laptop", "computer", "high-performance"],
      dimensions: {
        height: 0.6,
        width: 14,
        depth: 9,
        unit: "inches",
      },
      weight: 4.5,
      supplierId: supplierIds[0], // TechSupplies Inc.
      isAvailable: true,
      imageUrl: "https://example.com/laptop.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      name: "Wireless Noise-Cancelling Headphones",
      description: "Premium over-ear headphones with 20 hours battery life",
      price: 249.99,
      discountPercentage: 10,
      stock: 78,
      category: "Audio",
      tags: ["headphones", "wireless", "noise-cancelling"],
      weight: 0.55,
      supplierId: supplierIds[4], // JapanTech Co.
      isAvailable: true,
      imageUrl: "https://example.com/headphones.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      name: "Smart Home Hub",
      description: "Control all your smart devices from one central hub",
      price: 129.99,
      stock: 32,
      category: "Smart Home",
      tags: ["smart home", "IoT", "automation"],
      dimensions: {
        height: 1.5,
        width: 5.7,
        depth: 5.7,
        unit: "inches",
      },
      weight: 0.34,
      supplierId: supplierIds[2], // ElectroComp Systems
      isAvailable: true,
      imageUrl: "https://example.com/smarthub.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      name: "Professional DSLR Camera",
      description: "24.1 megapixel camera with interchangeable lenses",
      price: 899.99,
      discountPercentage: 5,
      stock: 12,
      category: "Photography",
      tags: ["camera", "DSLR", "professional"],
      dimensions: {
        height: 4.1,
        width: 5.8,
        depth: 3.1,
        unit: "inches",
      },
      weight: 1.25,
      supplierId: supplierIds[4], // JapanTech Co.
      isAvailable: true,
      imageUrl: "https://example.com/camera.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      name: "Ergonomic Office Chair",
      description:
        "Adjustable chair with lumbar support for long working hours",
      price: 349.99,
      stock: 23,
      category: "Furniture",
      tags: ["chair", "office", "ergonomic"],
      dimensions: {
        height: 45,
        width: 28,
        depth: 27,
        unit: "inches",
      },
      weight: 35,
      supplierId: supplierIds[3], // Quality Hardware
      isAvailable: true,
      imageUrl: "https://example.com/chair.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      name: "Ultra-Wide Gaming Monitor",
      description: "34-inch curved monitor with high refresh rate",
      price: 599.99,
      discountPercentage: 8,
      stock: 17,
      category: "Electronics",
      tags: ["monitor", "gaming", "ultrawide"],
      dimensions: {
        height: 16.9,
        width: 32.2,
        depth: 9.1,
        unit: "inches",
      },
      weight: 16.5,
      supplierId: supplierIds[0], // TechSupplies Inc.
      isAvailable: true,
      imageUrl: "https://example.com/monitor.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      name: "Wireless Charging Pad",
      description: "Fast-charging wireless pad compatible with all Qi devices",
      price: 39.99,
      stock: 120,
      category: "Accessories",
      tags: ["charger", "wireless", "mobile"],
      dimensions: {
        height: 0.4,
        width: 3.5,
        depth: 3.5,
        unit: "inches",
      },
      weight: 0.22,
      supplierId: supplierIds[2], // ElectroComp Systems
      isAvailable: true,
      imageUrl: "https://example.com/charger.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      name: "Mechanical Keyboard",
      description: "RGB backlit mechanical keyboard with customizable keys",
      price: 159.99,
      stock: 42,
      category: "Accessories",
      tags: ["keyboard", "mechanical", "gaming"],
      dimensions: {
        height: 1.5,
        width: 17.3,
        depth: 5.2,
        unit: "inches",
      },
      weight: 2.1,
      supplierId: supplierIds[5], // EuroComponents GmbH
      isAvailable: true,
      imageUrl: "https://example.com/keyboard.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      name: "Portable Bluetooth Speaker",
      description: "Waterproof speaker with 10 hours of battery life",
      price: 79.99,
      discountPercentage: 15,
      stock: 53,
      category: "Audio",
      tags: ["speaker", "bluetooth", "portable"],
      dimensions: {
        height: 2.8,
        width: 6.9,
        depth: 2.8,
        unit: "inches",
      },
      weight: 0.64,
      supplierId: supplierIds[7], // GreenTech Solutions
      isAvailable: true,
      imageUrl: "https://example.com/speaker.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      name: "Smart Watch",
      description: "Health and fitness tracking with smartphone notifications",
      price: 199.99,
      stock: 0,
      category: "Wearables",
      tags: ["watch", "smart", "fitness"],
      dimensions: {
        height: 1.5,
        width: 1.3,
        depth: 0.4,
        unit: "inches",
      },
      weight: 0.09,
      supplierId: supplierIds[9], // PremiumTech Ltd.
      isAvailable: false,
      imageUrl: "https://example.com/smartwatch.jpg",
      createdAt: new Date().toISOString(),
    },
  ];

  const result = await getDB()
    .collection("products")
    .insertMany(sampleProducts);
  return result;
}

// Main function to seed data
async function seedData() {
  try {
    console.log("Connecting to database...");
    await connectDB();

    const db = getDB();

    // Clear existing data
    console.log("Clearing existing collections...");
    await db.collection("suppliers").deleteMany({});
    await db.collection("products").deleteMany({});

    // Insert suppliers
    console.log("Inserting sample suppliers...");
    const suppliersResult = await db
      .collection("suppliers")
      .insertMany(sampleSuppliers);

    console.log(
      `${suppliersResult.insertedCount} suppliers inserted successfully!`
    );

    // Get supplier IDs for product references
    const supplierIds = Object.values(suppliersResult.insertedIds);

    // Insert products with supplier references
    console.log("Inserting sample products...");
    const productsResult = await populateProducts(supplierIds);

    console.log(
      `${productsResult.insertedCount} products inserted successfully!`
    );

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await closeDB();
  }
}

// Run the seed function
(async () => {
  await seedData();
})();
