const { Router } = require("express");
const productController = require("../controllers/productController");
const { productValidationRules } = require("../middleware/validation");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - stock
 *         - category
 *         - isAvailable
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Detailed product description
 *         price:
 *           type: number
 *           description: Product price
 *         discountPercentage:
 *           type: number
 *           description: Discount percentage (if applicable)
 *         stock:
 *           type: integer
 *           description: Available quantity in stock
 *         category:
 *           type: string
 *           description: Product category
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Product tags for search/filtering
 *         dimensions:
 *           type: object
 *           properties:
 *             height:
 *               type: number
 *             width:
 *               type: number
 *             depth:
 *               type: number
 *             unit:
 *               type: string
 *           description: Product dimensions
 *         weight:
 *           type: number
 *           description: Product weight in kg
 *         supplierId:
 *           type: string
 *           description: ID of the supplier
 *         isAvailable:
 *           type: boolean
 *           description: Whether product is available for purchase
 *         imageUrl:
 *           type: string
 *           description: URL to product image
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the product was added
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Returns all products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */
router.get("/", productController.getAllProducts);

/**
 * @swagger
 * /api/products/supplier/{supplierId}:
 *   get:
 *     summary: Get products by supplier ID
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products from the specified supplier
 *       400:
 *         description: Invalid supplier ID
 *       500:
 *         description: Server error
 */
router.get("/supplier/:supplierId", productController.getProductsBySupplier);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/:id", productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post("/", productValidationRules, productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put("/:id", productValidationRules, productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", productController.deleteProduct);

module.exports = router;
