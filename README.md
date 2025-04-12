# Inventory Management API

A comprehensive CRUD API for inventory management using MongoDB, Express, and Node.js.

## Features

- RESTful API for managing products and suppliers
- MVC architecture with model, controller, and route separation
- Two MongoDB collections with rich data models
- Comprehensive validation using both:
  - Express-validator for request data validation
  - Custom model-level validation methods
- Error handling for all routes
- API documentation with Swagger

## Project Structure

```
├── server.js           # Main application entry point
├── db.js               # Database connection module
├── swagger.js          # Swagger definition and generation script
├── generate-swagger.js # Script to generate swagger.json
├── controllers/        # Controller functions
│   ├── productController.js
│   └── supplierController.js
├── models/             # Data models with validation
│   ├── Product.js
│   └── Supplier.js
├── middleware/         # Middleware functions
│   └── validation.js   # Request validation rules
├── routes/             # API route definitions
│   ├── products.js
│   └── suppliers.js
└── swagger.json        # Generated API documentation
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd crud-api-project
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/product-api
PORT=3000
```

## Running the Application

Start the server:

```bash
npm start
```

For development with auto-restart on file changes:

```bash
npm run dev
```

## API Documentation

### Generating Swagger Documentation

After making changes to the API, you should update the Swagger documentation:

```bash
npm run swagger
```

This will generate an updated swagger.json file based on the definitions in swagger.js.

### Viewing API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `GET /api/products/supplier/:supplierId` - Get products from a specific supplier

### Suppliers

- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get a specific supplier
- `POST /api/suppliers` - Create a new supplier
- `PUT /api/suppliers/:id` - Update a supplier
- `DELETE /api/suppliers/:id` - Delete a supplier

## Data Models

### Product Schema

```json
{
  "name": "String (required)",
  "description": "String (required)",
  "price": "Number (required)",
  "discountPercentage": "Number (optional)",
  "stock": "Integer (required)",
  "category": "String (required)",
  "tags": ["String"],
  "dimensions": {
    "height": "Number",
    "width": "Number",
    "depth": "Number",
    "unit": "String"
  },
  "weight": "Number",
  "supplierId": "MongoDB ObjectId (reference to Supplier)",
  "isAvailable": "Boolean (required)",
  "imageUrl": "String (URL)",
  "createdAt": "Date"
}
```

### Supplier Schema

```json
{
  "name": "String (required)",
  "contactName": "String (required)",
  "email": "String (required)",
  "phone": "String (required)",
  "address": {
    "street": "String (required)",
    "city": "String (required)",
    "state": "String (required)",
    "zipCode": "String (required)"
  },
  "country": "String (required)",
  "supplierType": "String enum [manufacturer, wholesaler, distributor, retailer] (required)",
  "paymentTerms": "String (required)",
  "isActive": "Boolean (required)",
  "createdAt": "Date"
}
```

## Validation

The API implements two levels of validation:

1. **Request Validation**: Using express-validator in middleware/validation.js

   - Ensures incoming requests have correct data types and required fields
   - Provides detailed error messages for bad requests

2. **Model Validation**: Using custom validate methods in models
   - Performs deeper validation logic specific to each model
   - Handles business rules and constraints

## Error Handling

All routes implement consistent error handling with appropriate HTTP status codes:

- 400: Bad Request (validation errors, invalid IDs)
- 404: Not Found (item doesn't exist)
- 500: Server Error (database errors, unexpected issues)

## Deployment

This application can be deployed to various cloud platforms:

### Deploying to Heroku

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku:
   ```bash
   heroku login
   ```
3. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   ```
5. Push your code to Heroku:
   ```bash
   git push heroku main
   ```

### Deploying to Render

#### Manual Deployment

1. Create a [Render](https://render.com) account
2. From the Render dashboard, click "New" and select "Web Service"
3. Connect your GitHub repository or deploy from a public repository URL
4. Configure the web service:
   - **Name**: Choose a name for your service (e.g., "inventory-management-api")
   - **Environment**: Node
   - **Region**: Choose the closest region to your users
   - **Branch**: main (or your preferred branch)
   - **Build Command**: `npm install && npm run swagger`
   - **Start Command**: `node server.js`
   - **Plan**: Free (or select a paid plan for production use)
5. Add the following environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: production
   - `PORT`: 10000 (Render internally uses this)
   - `APP_URL`: Your Render app URL once deployed (e.g., https://inventory-management-api.onrender.com)
6. Click "Create Web Service"

#### Using render.yaml (Alternative)

This repository includes a `render.yaml` file for easier deployment:

1. Fork this repository on GitHub
2. Go to the [Render Dashboard](https://dashboard.render.com)
3. Click on the "New" button and select "Blueprint" from the dropdown
4. Connect your forked GitHub repository
5. Render will detect the `render.yaml` file and set up the service
6. You'll still need to manually configure the `MONGODB_URI` environment variable in the Render dashboard

#### Important Notes for Render Deployment

- The free tier of Render will spin down your web service after 15 minutes of inactivity
- The first request after inactivity will take a bit longer as the service spins back up
- For production use, consider upgrading to a paid plan
- If you need to seed your database, run `npm run seed` locally before deploying, or set up a one-time service in Render to run the seed script

### Deploying to Railway

1. Create a Railway account
2. Create a new project and link your GitHub repository
3. Add your environment variables in the Railway dashboard
4. Deploy your application

### Environment Variables

The following environment variables are required:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `PORT`: The port number (optional, defaults to 3000)

Make sure to keep these environment variables secure and never commit them to your repository.

## License

ISC
