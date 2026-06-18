const express = require("express");
const router = express.Router();

const productController =
require("../controllers/productController");

const upload =
require("../middleware/upload");

const {
requireAuth
} = require("../middleware/auth");

// LIST PRODUCTS
router.get(
"/",
requireAuth,
productController.listProducts
);

// ADD PRODUCT FORM
router.get(
    
"/add",
productController.showAddProduct
);

// SAVE PRODUCT
router.post(
"/add",
upload.single("image"),
productController.addProduct
);

// EDIT FORM
router.get(
"/edit/:id",
productController.showEditProduct
);

// UPDATE PRODUCT
router.post(
    "/edit/:id",
    upload.single("image"),
    productController.updateProduct
);

// DELETE PRODUCT
router.get(
"/delete/:id",
productController.deleteProduct
);

router.get(
    "/suggestions",
    productController.searchSuggestions
);

module.exports = router;
