// controllers/authController.js
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
	const { username, password } = req.body;

	try {
		const userExists = await User.findOne({ username });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		const user = await User.create({
			username,
			password,
		});

		if (user) {
			res.status(201).json({
				_id: user._id,
				username: user.username,
				token: generateToken(user._id),
			});
		} else {
			res.status(400).json({ message: "Invalid user data" });
		}
	} catch (error) {
		res.status(500).json({ message: "Server Error" });
	}
};

const authUser = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });

		if (user && (await user.matchPassword(password))) {
			res.json({
				_id: user._id,
				username: user.username,
				token: generateToken(user._id),
			});
		} else {
			res.status(401).json({ message: "Invalid username or password" });
		}
	} catch (error) {
		res.status(500).json({ message: "Server Error" });
	}
};

module.exports = { registerUser, authUser };
