const express = require("express");
const router = express.Router();

const productController =
    require("../controllers/productController");

// LIST PRODUCTS
router.get(
    "/",
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
    productController.updateProduct
);

// DELETE PRODUCT
router.get(
    "/delete/:id",
    productController.deleteProduct
);

module.exports = router;