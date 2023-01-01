const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const Vendor = require("../models/vendorModel");
const sendToken = require("../utils/jwtToken");
const Product = require("../models/productModel");

const crypto = require("crypto");
const { log } = require("console");

// reguister vendor
exports.registerVendor = catchAsyncError(async (req, res, next) => {

  const { name, email, password , address } = req.body;

  
  const vendor = await Vendor.create({
    name,
    email,
    password,
    address,
  });

  sendToken(vendor, 201, res);
});

// login vednor 

exports.loginVendor = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //Checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Password and Email", 400));
  }

  const vendor = await Vendor.findOne({ email }).select("+password");

  if (!vendor) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isPasswordMatched = await vendor.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(vendor, 200, res);
});

// Logout User
exports.logoutVendor = catchAsyncError(async (req, res, next) => {

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "vendor logged out successfully",
  });
});

// Create Product   --Vendor
exports.createProductVendor = catchAsyncError(async (req, res, next) => {

    console.log(req);
    
    req.body.vendor = req.vendor.id;
    const product = await Product.create(req.body);

    res.status(201).json({
    success: true,
    product,
    });
});

// Update product --vendor
exports.updateProductVendor = catchAsyncError(async (req, res, next) => {
  let product = Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete a product -- vendor
exports.deleteProductVendor = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Deleted successfully",
  });
});

// Forgot password
exports.forgotPasswordVendor = catchAsyncError(async (req, res, next) => {
  const vendor = await Vendor.findOne({ email: req.body.email });

  if (!vendor) {
    return next(new ErrorHandler("Vendor  not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = await vendor.getResetPasswordToken();

  await vendor.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  res.status(200).json({
    success: true,
    message: `Email sent to ${vendor.email} successfully`,
    resetPasswordUrl,
  });
  try {
    await sendEmail({
      email: vendor.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await vendor.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset password
exports.resetPasswordVendor = catchAsyncError(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log(resetPasswordToken);
  const vendor = await Vendor.findOne({
    resetPasswordToken,
  });

  if (!vendor) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  vendor.password = req.body.password;
  vendor.resetPasswordToken = undefined;
  vendor.resetPasswordExpire = undefined;

  await vendor.save();

  sendToken(vendor, 200, res);
});
