const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Resume = require("../models/Resume");
const { Configuration, OpenAIApi } = require("openai");
const router = express.Router();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
	apiKey: "YOUR_OPENAI_API_KEY",
});
const openai = new OpenAIApi(configuration);

router.post("/:id/ai-suggestions", authenticate, async (req, res) => {
	const { jobDescription } = req.body;
	try {
		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: `Provide resume improvement suggestions based on the job description: ${jobDescription}`,
			max_tokens: 100,
		});
		res.json(response.data.choices[0].text);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Middleware to verify token
const authenticate = (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1];
	if (!token) return res.status(401).json({ error: "Access denied" });

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		next();
	} catch (error) {
		res.status(400).json({ error: "Invalid token" });
	}
};

// Create Resume
router.post(
	"/",
	authenticate,
	[
		body("title").notEmpty().withMessage("Title is required"),
		// Add more validation for other fields if necessary
	],
	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { title, personalInfo, workExperience, education, skills } = req.body;
		try {
			const newResume = new Resume({
				userId: req.user.userId,
				title,
				personalInfo,
				workExperience,
				education,
				skills,
			});
			await newResume.save();
			res.status(201).json(newResume);
		} catch (error) {
			next(error);
		}
	},
);

// Edit Resume
router.put("/:id", authenticate, async (req, res, next) => {
	try {
		const resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.json(resume);
	} catch (error) {
		next(error);
	}
});

// Delete Resume
router.delete("/:id", authenticate, async (req, res, next) => {
	try {
		await Resume.findByIdAndDelete(req.params.id);
		res.json({ message: "Resume deleted" });
	} catch (error) {
		next(error);
	}
});

// Get AI Suggestions
router.post("/:id/ai-suggestions", authenticate, async (req, res, next) => {
	const { jobDescription } = req.body;
	try {
		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: `Provide resume improvement suggestions based on the job description: ${jobDescription}`,
			max_tokens: 100,
		});
		res.json(response.data.choices[0].text);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
