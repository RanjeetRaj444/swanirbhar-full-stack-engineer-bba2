const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();

// Register
router.post(
	"/register",
	[
		body("username").notEmpty().withMessage("Username is required"),
		body("email").isEmail().withMessage("Email is invalid"),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters long"),
	],
	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { username, email, password } = req.body;
		try {
			const userExists = await User.findOne({ email });
			if (userExists) {
				return res.status(400).json({ error: "User already exists" });
			}
			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = new User({ username, email, password: hashedPassword });
			await newUser.save();
			res.status(201).json({ message: "User registered successfully" });
		} catch (error) {
			next(error);
		}
	},
);

// Login
router.post(
	"/login",
	[
		body("email").isEmail().withMessage("Email is invalid"),
		body("password").notEmpty().withMessage("Password is required"),
	],
	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;
		try {
			const user = await User.findOne({ email });
			if (!user || !(await bcrypt.compare(password, user.password))) {
				return res.status(400).json({ error: "Invalid credentials" });
			}
			const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
				expiresIn: "1h",
			});
			res.json({ token });
		} catch (error) {
			next(error);
		}
	},
);

module.exports = router;
