import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
    sendPasswordResetEmail,
    sendPasswordResetSuccessEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
} from "../mailtrap/emails.js";
import crypto from "crypto";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";

dotenv.config();

export const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ msg: "Please fill in all fields" });
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
        return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
        100000 + Math.random() * 900000
    ).toString();
    const user = new User({
        name,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires: Date.now() + 600000,
    });
    await user.save();

    generateTokenAndSetCookie(res, user._id); // generate JWT token and set cookie
    await sendVerificationEmail(user.email, verificationToken); // send verification email

    res.status(201).json({
        msg: "User created successfully  ",
        user: { ...user._doc, password: undefined },
    });
});

export const verifyEmail = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const user = await User.findOne({
        verificationToken: code,
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired verification code",
            code,
        });
    }

    user.isVerfied = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
        success: true,
        message: "Email verified successfully",
        user: {
            ...user._doc,
            password: undefined,
        },
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ msg: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ msg: "Invalid credentials" });
    }
    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
        msg: "Logged in successfully",
        user: { ...user._doc, password: undefined },
    });
});

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ msg: "Logged out successfully" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ msg: "User not found" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    await sendPasswordResetEmail(
        user.email,
        `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({ msg: "Verification code sent to your email" });
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired reset token",
        });
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await sendPasswordResetSuccessEmail(user.email);

    res.status(200).json({
        success: true,
        message: "Password reset successful",
    });
});

export const checkAuth = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
        return res
            .status(400)
            .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
});
