const Product = require("../models/productModel");

// LIST PRODUCTS
exports.listProducts = (req, res) => {
    const search = req.query.search || "";
    const category = req.query.category || "";

    const page =
        parseInt(req.query.page) || 1;

    const limit = 6;

    const offset =
        (page - 1) * limit;

    Product.getAllProducts((err, allProducts) => {
        if (err) {
            console.error(
                "listProducts - getAllProducts error:",
                err
            );

            return res.status(500).send(err);
        }

        const categories = [];

        allProducts.forEach((product) => {
            if (
                product.category &&
                categories.indexOf(product.category) === -1
            ) {
                categories.push(product.category);
            }
        });

        Product.countFilteredProducts(
            search,
            category,
            (err, countResults) => {
                if (err) {
                    console.error(
                        "listProducts - countFilteredProducts error:",
                        err
                    );

                    return res.status(500).send(err);
                }

                const totalProducts =
                    countResults[0].total;

                const totalPages =
                    Math.ceil(totalProducts / limit);

                Product.searchProductsPaginated(
                    search,
                    category,
                    limit,
                    offset,
                    (err, results) => {
                        if (err) {
                            console.error(
                                "listProducts - searchProductsPaginated error:",
                                err
                            );

                            return res.status(500).send(err);
                        }

                        res.render(
                            "products/list-products",
                            {
                                products: results,
                                categories: categories,
                                currentSearch: search,
                                currentCategory: category,
                                currentPage: page,
                                totalPages: totalPages
                            }
                        );
                    }
                );
            }
        );
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