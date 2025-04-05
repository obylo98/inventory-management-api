const { Router } = require("express");
const supplierController = require("../controllers/supplierController");
const { supplierValidationRules } = require("../middleware/validation");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       required:
 *         - name
 *         - contactName
 *         - email
 *         - phone
 *         - address
 *         - country
 *         - isActive
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: Company name of the supplier
 *         contactName:
 *           type: string
 *           description: Primary contact person's name
 *         email:
 *           type: string
 *           description: Contact email address
 *         phone:
 *           type: string
 *           description: Contact phone number
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             zipCode:
 *               type: string
 *         country:
 *           type: string
 *           description: Country of operation
 *         supplierType:
 *           type: string
 *           enum: [manufacturer, wholesaler, distributor, retailer]
 *           description: Type of supplier
 *         paymentTerms:
 *           type: string
 *           description: Payment terms offered by the supplier
 *         isActive:
 *           type: boolean
 *           description: Whether supplier is currently active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the supplier was added
 */

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Returns all suppliers
 *     responses:
 *       200:
 *         description: A list of suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 *       500:
 *         description: Server error
 */
router.get("/", supplierController.getAllSuppliers);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get a supplier by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single supplier
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Invalid supplier ID
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.get("/:id", supplierController.getSupplierById);

/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     summary: Create a new supplier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post("/", supplierValidationRules, supplierController.createSupplier);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     summary: Update a supplier
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
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.put("/:id", supplierValidationRules, supplierController.updateSupplier);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Delete a supplier
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *       400:
 *         description: Invalid supplier ID
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", supplierController.deleteSupplier);

module.exports = router;
