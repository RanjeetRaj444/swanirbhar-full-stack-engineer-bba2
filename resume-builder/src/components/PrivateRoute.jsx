import React from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const redirects = useNavigate();
	const token = localStorage.getItem("token");
	if (token) {
		return children;
	}
	return redirects("/login");
};

export default PrivateRoute;
