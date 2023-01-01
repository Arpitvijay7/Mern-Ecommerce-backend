const express = require("express");
const {
  registerVendor,
  loginVendor,
  logoutVendor,
  forgotPasswordVendor,
  resetPasswordVendor,
  createProductVendor,
  updateProductVendor,
  deleteProductVendor,
} = require("../controllers/vendorController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/Vendorauth");


const router = express.Router();

router.route("/vendor/register").post(registerVendor);

router.route("/vendor/login").post(loginVendor);

router.route("/vendor/logout").get(logoutVendor);

router.route("/vendor/password/forgot").post(forgotPasswordVendor);

router.route("/vendor/password/reset/:token").put(resetPasswordVendor);

router
  .route("/vendor/products/:id")
  .put(isAuthenticatedUser, authorizedRoles("unapproved"), updateProductVendor)
  .delete(isAuthenticatedUser, authorizedRoles("unapproved"), deleteProductVendor);


router
  .route("/vendor/products/new")
  .post(
    isAuthenticatedUser,
    authorizedRoles("unapproved"),
    createProductVendor
  );

module.exports = router;