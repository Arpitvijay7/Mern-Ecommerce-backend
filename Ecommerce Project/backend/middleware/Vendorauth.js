const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Vendor = require("../models/vendorModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("PLease Login to access this resource ", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.vendor = await Vendor.findById(decodedData.id);

  console.log(req.vendor);

  next();
});

exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.vendor.status)) {
      return next(
        new ErrorHandler(
          `Role : ${req.vendor.role} is not allowed to access the resource`,
          403
        )
      );
    }

    next();
  };
};
