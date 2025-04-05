const { body } = require("express-validator");
const { ObjectId } = require("mongodb");

/**
 * Product validation rules
 */
exports.productValidationRules = [
  body("name")
    .isString()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("description")
    .isString()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("discountPercentage")
    .optional()
    .isNumeric()
    .withMessage("Discount percentage must be a number"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("category").isString().notEmpty().withMessage("Category is required"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("dimensions")
    .optional()
    .isObject()
    .withMessage("Dimensions must be an object"),
  body("dimensions.height")
    .optional()
    .isNumeric()
    .withMessage("Height must be a number"),
  body("dimensions.width")
    .optional()
    .isNumeric()
    .withMessage("Width must be a number"),
  body("dimensions.depth")
    .optional()
    .isNumeric()
    .withMessage("Depth must be a number"),
  body("dimensions.unit")
    .optional()
    .isString()
    .withMessage("Unit must be a string"),
  body("weight").optional().isNumeric().withMessage("Weight must be a number"),
  body("supplierId")
    .optional()
    .custom((value) => {
      if (value && !ObjectId.isValid(value)) {
        throw new Error("Invalid supplier ID");
      }
      return true;
    }),
  body("isAvailable").isBoolean().withMessage("isAvailable must be a boolean"),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
];

/**
 * Supplier validation rules
 */
exports.supplierValidationRules = [
  body("name")
    .isString()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("contactName")
    .isString()
    .notEmpty()
    .withMessage("Contact name is required"),
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("phone").isString().notEmpty().withMessage("Phone number is required"),
  body("address").isObject().withMessage("Address must be an object"),
  body("address.street")
    .isString()
    .notEmpty()
    .withMessage("Street address is required"),
  body("address.city").isString().notEmpty().withMessage("City is required"),
  body("address.state").isString().notEmpty().withMessage("State is required"),
  body("address.zipCode")
    .isString()
    .notEmpty()
    .withMessage("Zip code is required"),
  body("country").isString().notEmpty().withMessage("Country is required"),
  body("supplierType")
    .isIn(["manufacturer", "wholesaler", "distributor", "retailer"])
    .withMessage(
      "Supplier type must be one of: manufacturer, wholesaler, distributor, retailer"
    ),
  body("paymentTerms")
    .isString()
    .notEmpty()
    .withMessage("Payment terms are required"),
  body("isActive").isBoolean().withMessage("isActive must be a boolean"),
];
