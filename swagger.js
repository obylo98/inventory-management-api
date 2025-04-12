/**
 * Swagger documentation generator
 * This file generates the swagger.json file for the API documentation
 */

const fs = require("fs");
const path = require("path");

// Basic API information
const apiInfo = {
  openapi: "3.0.0",
  info: {
    title: "Inventory Management API",
    description:
      "A comprehensive CRUD API for inventory management using MongoDB, Express, and Node.js",
    version: "1.0.0",
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "https://inventory-management-api-hi7k.onrender.com/",
      description: "Production server",
    },
  ],
  tags: [
    {
      name: "Products",
      description: "Operations about products",
    },
    {
      name: "Suppliers",
      description: "Operations about suppliers",
    },
  ],
};

// Schema definitions
const schemas = {
  Product: {
    type: "object",
    required: [
      "name",
      "description",
      "price",
      "stock",
      "category",
      "isAvailable",
    ],
    properties: {
      _id: {
        type: "string",
        description: "Auto-generated MongoDB ID",
        example: "60d21b4667d0d8992e610c85",
      },
      name: {
        type: "string",
        example: "Wireless Bluetooth Headphones",
      },
      description: {
        type: "string",
        example:
          "Premium noise-cancelling wireless headphones with 30-hour battery life.",
      },
      price: {
        type: "number",
        format: "float",
        example: 129.99,
      },
      discountPercentage: {
        type: "number",
        format: "float",
        example: 15,
      },
      stock: {
        type: "integer",
        format: "int32",
        example: 45,
      },
      category: {
        type: "string",
        example: "Electronics",
      },
      tags: {
        type: "array",
        items: {
          type: "string",
        },
        example: ["headphones", "bluetooth", "wireless", "audio"],
      },
      dimensions: {
        type: "object",
        properties: {
          height: {
            type: "number",
            format: "float",
            example: 7.5,
          },
          width: {
            type: "number",
            format: "float",
            example: 6.3,
          },
          depth: {
            type: "number",
            format: "float",
            example: 3.2,
          },
          unit: {
            type: "string",
            example: "inches",
          },
        },
      },
      weight: {
        type: "number",
        format: "float",
        example: 0.68,
      },
      supplierId: {
        type: "string",
        example: "60d21b4667d0d8992e610c84",
      },
      isAvailable: {
        type: "boolean",
        example: true,
      },
      imageUrl: {
        type: "string",
        example: "https://example.com/images/headphones.jpg",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2023-04-15T10:30:00.000Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2023-04-16T14:20:00.000Z",
      },
    },
  },
  Supplier: {
    type: "object",
    required: [
      "name",
      "contactName",
      "email",
      "phone",
      "address",
      "country",
      "supplierType",
      "paymentTerms",
      "isActive",
    ],
    properties: {
      _id: {
        type: "string",
        description: "Auto-generated MongoDB ID",
        example: "60d21b4667d0d8992e610c84",
      },
      name: {
        type: "string",
        example: "TechGadgets Inc.",
      },
      contactName: {
        type: "string",
        example: "John Smith",
      },
      email: {
        type: "string",
        format: "email",
        example: "john.smith@techgadgets.com",
      },
      phone: {
        type: "string",
        example: "555-123-4567",
      },
      address: {
        type: "object",
        properties: {
          street: {
            type: "string",
            example: "123 Tech Boulevard",
          },
          city: {
            type: "string",
            example: "San Francisco",
          },
          state: {
            type: "string",
            example: "CA",
          },
          zipCode: {
            type: "string",
            example: "94105",
          },
        },
      },
      country: {
        type: "string",
        example: "United States",
      },
      supplierType: {
        type: "string",
        enum: ["manufacturer", "wholesaler", "distributor", "retailer"],
        example: "manufacturer",
      },
      paymentTerms: {
        type: "string",
        example: "Net 30",
      },
      isActive: {
        type: "boolean",
        example: true,
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2023-04-15T10:30:00.000Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2023-04-16T14:20:00.000Z",
      },
    },
  },
};

// Product paths
const productPaths = {
  "/api/products": {
    get: {
      tags: ["Products"],
      summary: "Get all products",
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
        },
        500: {
          description: "Server error",
        },
      },
    },
    post: {
      tags: ["Products"],
      summary: "Add a new product",
      requestBody: {
        description: "Product object that needs to be added",
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Product",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Product created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Product",
              },
            },
          },
        },
        400: {
          description: "Invalid input",
        },
        500: {
          description: "Server error",
        },
      },
    },
  },
  "/api/products/{id}": {
    get: {
      tags: ["Products"],
      summary: "Find product by ID",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of product to return",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Product",
              },
            },
          },
        },
        400: {
          description: "Invalid ID supplied",
        },
        404: {
          description: "Product not found",
        },
        500: {
          description: "Server error",
        },
      },
    },
    put: {
      tags: ["Products"],
      summary: "Update an existing product",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of product to update",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        description: "Product object that needs to be updated",
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Product",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Product",
              },
            },
          },
        },
        400: {
          description: "Invalid input",
        },
        404: {
          description: "Product not found",
        },
        500: {
          description: "Server error",
        },
      },
    },
    delete: {
      tags: ["Products"],
      summary: "Delete a product",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of product to delete",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product deleted successfully",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid ID supplied",
        },
        404: {
          description: "Product not found",
        },
        500: {
          description: "Server error",
        },
      },
    },
  },
  "/api/products/supplier/{supplierId}": {
    get: {
      tags: ["Products"],
      summary: "Find products by supplier ID",
      parameters: [
        {
          name: "supplierId",
          in: "path",
          description: "ID of supplier to find products for",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
        },
        400: {
          description: "Invalid supplier ID supplied",
        },
        500: {
          description: "Server error",
        },
      },
    },
  },
};

// Supplier paths
const supplierPaths = {
  "/api/suppliers": {
    get: {
      tags: ["Suppliers"],
      summary: "Get all suppliers",
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Supplier",
                },
              },
            },
          },
        },
        500: {
          description: "Server error",
        },
      },
    },
    post: {
      tags: ["Suppliers"],
      summary: "Add a new supplier",
      requestBody: {
        description: "Supplier object that needs to be added",
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Supplier",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Supplier created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Supplier",
              },
            },
          },
        },
        400: {
          description: "Invalid input",
        },
        500: {
          description: "Server error",
        },
      },
    },
  },
  "/api/suppliers/{id}": {
    get: {
      tags: ["Suppliers"],
      summary: "Find supplier by ID",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of supplier to return",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Supplier",
              },
            },
          },
        },
        400: {
          description: "Invalid ID supplied",
        },
        404: {
          description: "Supplier not found",
        },
        500: {
          description: "Server error",
        },
      },
    },
    put: {
      tags: ["Suppliers"],
      summary: "Update an existing supplier",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of supplier to update",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        description: "Supplier object that needs to be updated",
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Supplier",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Supplier",
              },
            },
          },
        },
        400: {
          description: "Invalid input",
        },
        404: {
          description: "Supplier not found",
        },
        500: {
          description: "Server error",
        },
      },
    },
    delete: {
      tags: ["Suppliers"],
      summary: "Delete a supplier",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of supplier to delete",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Supplier deleted successfully",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid ID supplied",
        },
        404: {
          description: "Supplier not found",
        },
        500: {
          description: "Server error",
        },
      },
    },
  },
};

// Combine all paths
const paths = {
  ...productPaths,
  ...supplierPaths,
};

// Combine everything into the swagger document
const swaggerDocument = {
  ...apiInfo,
  paths,
  components: {
    schemas,
  },
};

// Function to generate the swagger.json file
function generateSwaggerFile() {
  return new Promise((resolve, reject) => {
    const swaggerJson = JSON.stringify(swaggerDocument, null, 2);
    const filePath = path.join(__dirname, "swagger.json");

    fs.writeFile(filePath, swaggerJson, (err) => {
      if (err) {
        console.error("Error writing swagger.json file:", err);
        reject(err);
        return;
      }
      console.log("swagger.json file has been generated successfully");
      resolve();
    });
  });
}

// Generate the file when this script is run directly (not when imported as a module)
if (require.main === module) {
  generateSwaggerFile().catch((err) => {
    console.error("Failed to generate swagger.json:", err);
    process.exit(1);
  });
}

module.exports = {
  generateSwaggerFile,
  swaggerDocument,
};
