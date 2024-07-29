const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const path = require("path");
const app = express();
const PORT = 4000;
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 * 5 },
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

dotenv.config();
connectDB();

const { OpenAI } = require("openai");
const openai = new OpenAI({
	apiKey: process.env.API_KEY, // This is also the default, can be omitted
});

const GPTFunction = async (text) => {
	const response = await openai.completions.create({
		model: "gpt-3.5-turbo-instruct",
		prompt: text,
		temperature: 0.6,
		max_tokens: 250,
		top_p: 1,
		frequency_penalty: 1,
		presence_penalty: 1,
	});
	return response.choices[0].text;
};

app.get("/api", (req, res) => {
	res.json({
		message: "Hello world",
	});
});
app.use("/api/auth", authRoutes);
// const PORT = process.env.PORT || 5000;

let database = [];
app.post("/resume/create", upload.single("headshotImage"), async (req, res) => {
	const {
		fullName,
		currentPosition,
		currentLength,
		currentTechnologies,
		workHistory,
	} = req.body;

	const workArray = JSON.parse(workHistory); //an array
	function generateID() {
		const timestamp = Date.now(); // Current timestamp in milliseconds
		const randomNum = Math.floor(Math.random() * 1e9); // Random number with up to 9 digits
		return `id-${timestamp}-${randomNum}`;
	}
	//👇🏻 group the values into an object
	const newEntry = {
		id: generateID(),
		fullName,
		image_url: `http://localhost:4000/uploads/${req.file.filename}`,
		currentPosition,
		currentLength,
		currentTechnologies,
		workHistory: workArray,
	};
	const remainderText = () => {
		let stringText = "";
		for (let i = 0; i < workArray.length; i++) {
			stringText += ` ${workArray[i].name} as a ${workArray[i].position}.`;
		}
		return stringText;
	};
	//👇🏻 The job description prompt
	const prompt1 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n I write in the technolegies: ${currentTechnologies}. Can you write a 100 words description for the top of the resume(first person writing)?`;
	//👇🏻 The job responsibilities prompt
	const prompt2 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n I write in the technolegies: ${currentTechnologies}. Can you write 10 points for a resume on what I am good at?`;
	//👇🏻 The job achievements prompt
	const prompt3 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n During my years I worked at ${
		workArray.length
	} companies. ${remainderText()} \n Can you write me 50 words for each company seperated in numbers of my succession in the company (in first person)?`;

	//👇🏻 generate a GPT-3 result
	const objective = await GPTFunction(prompt1);
	const keypoints = await GPTFunction(prompt2);
	const jobResponsibilities = await GPTFunction(prompt3);
	//👇🏻 put them into an object
	const chatgptData = { objective, keypoints, jobResponsibilities };
	//👇🏻log the result
	// console.log(chatgptData);

	const data = { ...newEntry, ...chatgptData };
	database.push(data);

	res.json({
		message: "Request successful!",
		data: {},
	});
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
