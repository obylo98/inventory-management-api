const { Router } = require("express");
const supplierController = require("../controllers/supplierController");
const { supplierValidationRules } = require("../middleware/validation");
const { authenticate, requireAuth } = require("../middleware/auth");

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
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: Company name
 *         contactName:
 *           type: string
 *           description: Name of primary contact
 *         email:
 *           type: string
 *           format: email
 *           description: Business email address
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
 *             zip:
 *               type: string
 *             country:
 *               type: string
 *           description: Business address
 *         website:
 *           type: string
 *           description: Company website URL
 *         paymentTerms:
 *           type: string
 *           description: Payment terms (e.g., "Net 30")
 *         notes:
 *           type: string
 *           description: Additional notes about supplier
 *         active:
 *           type: boolean
 *           description: Whether supplier relationship is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when supplier was added
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when supplier was last updated
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Apply authentication middleware to all routes
router.use(authenticate);

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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  requireAuth,
  supplierValidationRules,
  supplierController.createSupplier
);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     summary: Update a supplier
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  requireAuth,
  supplierValidationRules,
  supplierController.updateSupplier
);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Delete a supplier
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", requireAuth, supplierController.deleteSupplier);

module.exports = router;
