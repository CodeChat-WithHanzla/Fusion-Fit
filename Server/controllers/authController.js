const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../helpers/sendEmail");
const ErrorHandler = require("../helpers/errorHandler");
const asyncHandler = require("../helpers/asyncHandler");

// **Signup Controller**
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validate required fields
  if (!name || !email || !password || !confirmPassword) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  // Validate password length
  if (password.length < 8) {
    return next(
      new ErrorHandler("Password must be at least 8 characters long", 400)
    );
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email is already registered", 400));
  }

  // Create a new user and save to the database
  const newUser = await User.create({
    name,
    email,
    password,
    verificationToken: crypto.randomBytes(20).toString("hex") // Save the verification token
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully. Please verify your email.",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email
    }
  });
});
// **Login Controller**
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return next(
      new ErrorHandler("Please provide both email and password", 400)
    );
  }

  // Check if user exists with the given email
  const user = await User.findOne({ email }).select("+password"); // Explicitly select password

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Verify the user's password
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  user.password = undefined;
  user.verificationToken = undefined;
  user.resetPasswordToken = undefined;

  // Generate JWT token
  const token = user.generateAuthToken();

  // Construct response object
  const response = {
    success: true,
    message: "Login successful",
    token,
    user
  };

  // Add a warning message for unverified users
  if (!user.isVerified) {
    response.warning =
      "Your account is not verified. Please verify your email to access all features.";
  }

  // Return success response
  res.status(200).json(response);
});
// ** Send Verification Email **
exports.sendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified." });
    }

    // Generate a unique verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Save the token in the database
    user.verificationToken = verificationTokenHash;
    user.verificationTokenExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      email: user.email,
      subject: "Verify Your Email Address",
      title: "Email Verification",
      greeting: `Hi ${user.name},`,
      body: "Click the button below to verify your email address.",
      actionUrl: verificationUrl,
      actionText: "Verify Email"
    });

    res.status(200).json({ message: "Verification email sent successfully." });
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};
// ** Verify Email **
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: "Verification token is required." });
    }

    // Hash the token to match the stored value
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user with the matching verification token
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpire: { $gt: Date.now() } // Ensure the token hasn't expired
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email successfully verified!"
    });
  } catch (error) {
    res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
      error
    });
  }
};
// **FORGOT PASSWORD**
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Step 1: Check if user exists with the provided email
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Step 2: Generate reset token and save to the user document
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Step 3: Create the reset password URL
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const subject = "Reset Your Password";
  const title = "Password Reset Request";
  const greeting = `Hi ${user.name},`;
  const body = "Click the button below to reset your password.";
  const actionText = "Reset Password";

  try {
    // Step 4: Send reset password email
    await sendEmail({
      email: user.email,
      subject,
      title,
      greeting,
      body,
      actionUrl: resetUrl,
      actionText
    });

    // Step 5: Respond to the client
    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully"
    });
  } catch (error) {
    // Step 6: Cleanup reset token if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("Email could not be sent", 500));
  }
});
// ** Reset Password **
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  // Step 1: Validate the input
  if (!password || !confirmPassword) {
    return next(new ErrorHandler("Please provide both password fields", 400));
  }

  if (password.length < 8) {
    return next(
      new ErrorHandler("Password must be at least 8 characters long", 400)
    );
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  // Step 2: Hash the token from the URL and find the user
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() } // Ensure token has not expired
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or expired token", 400));
  }

  // Step 3: Update the user's password and clear the reset token fields
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Save the updated user to the database
  await user.save();

  // Step 5: Respond to the client
  res.status(200).json({
    success: true,
    message: "Password reset successfully! You can now log in."
  });
});
