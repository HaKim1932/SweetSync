const Cart = require("../models/cartModel");

// VIEW CART
exports.viewCart = (req, res) => {
  const userId = req.session.user.id;

  Cart.getUserCart(userId, (err, carts) => {
    if (err) {
      console.error('viewCart - getUserCart error:', err);
      return res.redirect('/');
    }

    if (!carts || carts.length === 0) {
      return res.render('cart', {
        items: [],
        grandTotal: 0
      });
    }

    const cartId = carts[0].id;

    Cart.getCartTotal(cartId, (err, data) => {
      if (err) {
        console.error('viewCart - getCartTotal error:', err);
        return res.redirect('/');
      }

      res.render('cart', {
        items: data.items,
        grandTotal: data.grandTotal
      });
    });
  });
};

// ADD TO CART
exports.addToCart = (req, res) => {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    const userId =
        req.session.user.id;

    const productId =
        req.params.productId;

    Cart.getUserCart(
        userId,
        (err, carts) => {
            if (err) {
                return res.send(err);
            }

            // CREATE CART IF NONE
            if (carts.length === 0) {
                Cart.createCart(
                    userId,
                    (err, result) => {
                        if (err) {
                            return res.send(err);
                        }

                        Cart.addToCart(
                            result.insertId,
                            productId,
                            1,
                            () => {
                                res.redirect(
                                    "/cart"
                                );
                            }
                        );
                    }
                );
            } else {
                Cart.addToCart(
                    carts[0].id,
                    productId,
                    1,
                    () => {
                        res.redirect(
                            "/cart"
                        );
                    }
                );
            }
        }
    );
};
exports.increaseQuantity = (req, res) => {
  const cartItemId = req.params.cartItemId;

  Cart.getCartItemById(cartItemId, (err, item) => {
    if (err) {
      console.error('increaseQuantity - getCartItemById error:', err);
      return res.redirect('/cart');
    }
    if (!item) {
      return res.redirect('/cart');
    }

    const newQuantity = item.quantity + 1;

    Cart.updateCartItemQuantity(cartItemId, newQuantity, (err) => {
      if (err) {
        console.error('increaseQuantity - updateCartItemQuantity error:', err);
      }
      res.redirect('/cart');
    });
  });
};

exports.decreaseQuantity = (req, res) => {
  const cartItemId = req.params.cartItemId;

  Cart.getCartItemById(cartItemId, (err, item) => {
    if (err) {
      console.error('decreaseQuantity - getCartItemById error:', err);
      return res.redirect('/cart');
    }
    if (!item) {
      return res.redirect('/cart');
    }

    // If quantity is already 1, remove the item entirely
    if (item.quantity <= 1) {
      Cart.removeCartItem(cartItemId, (err) => {
        if (err) {
          console.error('decreaseQuantity - removeCartItem error:', err);
        }
        res.redirect('/cart');
      });
    } else {
      const newQuantity = item.quantity - 1;

      Cart.updateCartItemQuantity(cartItemId, newQuantity, (err) => {
        if (err) {
          console.error('decreaseQuantity - updateCartItemQuantity error:', err);
        }
        res.redirect('/cart');
      });
    }
  });
};

exports.removeCartItem = (req, res) => {
  const cartItemId = req.params.cartItemId;

  Cart.removeCartItem(cartItemId, (err) => {
    if (err) {
      console.error('removeCartItem error:', err);
    }
    res.redirect('/cart');
  });
};