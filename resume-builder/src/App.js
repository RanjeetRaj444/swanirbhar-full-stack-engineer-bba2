import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Resume from "./components/Resume";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
	//👇🏻 state holding the result
	const [result, setResult] = useState({});

	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={
							// <PrivateRoute>
								<Home setResult={setResult} />
							// </PrivateRoute>
						}
					/>
					<Route
						path="/resume"
						element={
							// <PrivateRoute>
								<Resume result={result} />
							// </PrivateRoute>
						}
					/>
					<Route path="/login" element={<Login />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
