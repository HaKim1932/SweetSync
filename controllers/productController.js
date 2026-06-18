const Product = require("../models/productModel");

// LIST PRODUCTS
exports.listProducts = (req, res) => {
  const search = req.query.search || '';
  const category = req.query.category || '';

  // Get distinct categories for the filter buttons
  Product.getAllProducts((err, allProducts) => {
    if (err) {
      console.error('listProducts - getAllProducts error:', err);
      return res.status(500).send(err);
    }

    // Extract unique categories from all products
    const categories = [];
    allProducts.forEach((product) => {
      if (
        product.category &&
        categories.indexOf(product.category) === -1
      ) {
        categories.push(product.category);
      }
    });

    // Now run search/filter query
    Product.searchProducts(search, category, (err, results) => {
      if (err) {
        console.error('listProducts - searchProducts error:', err);
        return res.status(500).send(err);
      }

      res.render('products/list-products', {
        products: results,
        categories: categories,
        currentSearch: search,
        currentCategory: category
      });
    });
  });
};

// SHOW ADD FORM
exports.showAddProduct = (req, res) => {
    res.render("products/add-product");
};

// ADD PRODUCT
exports.addProduct = (req, res) => {


const {
    name,
    description,
    price,
    stock,
    category
} = req.body;

const image =
    req.file
        ? "images/" + req.file.filename
        : null;

Product.createProduct(
    name,
    description,
    price,
    stock,
    category,
    image,
    (err) => {

        if (err) {
            return res
                .status(500)
                .send(err);
        }

        res.redirect(
            "/products"
        );

    }
);


};


// SHOW EDIT FORM
exports.showEditProduct = (req, res) => {
    const id = req.params.id;

    Product.getProductById(
        id,
        (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (results.length === 0) {
                return res.send("Product not found");
            }

            res.render(
                "products/edit-product",
                {
                    product: results[0]
                }
            );
        }
    );
};

// UPDATE PRODUCT
exports.updateProduct = (req, res) => {
    const id = req.params.id;

    const {
        name,
        description,
        price,
        stock,
        category
    } = req.body;

    const image =
        req.file
            ? "images/" + req.file.filename
            : null;

    Product.updateProduct(
        id,
        name,
        description,
        price,
        stock,
        category,
        image,
        (err) => {
            if (err) {
                return res.status(500).send(err);
            }

            res.redirect("/products");
        }
    );
};

// DELETE PRODUCT
exports.deleteProduct = (req, res) => {
    const id = req.params.id;

    Product.deleteProduct(
        id,
        (err) => {
            if (err) {
                return res.status(500).send(err);
            }

            res.redirect("/products");
        }
    );
};
// AJAX SEARCH SUGGESTIONS
exports.searchSuggestions = (req, res) => {
    const keyword =
        req.query.keyword || "";

    if (keyword.trim() === "") {
        return res.json([]);
    }

    Product.getSearchSuggestions(
        keyword,
        (err, results) => {
            if (err) {
                return res.status(500).json([]);
            }

            res.json(results);
        }
    );
};