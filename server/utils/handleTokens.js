import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { getRefreshToken } from "../models/token.models.js";

const publicKey = readFileSync("../publicKey.pem", { encoding: "utf-8" });
const privateKey = readFileSync("../privateKey.pem", { encoding: "utf-8" });

export const genAccessToken = (payload) => {
	try {
		const accessToken = jwt.sign(payload, privateKey, {
			algorithm: "RS256",
			expiresIn: "15m", // 15 minutes
		});
		return accessToken;
	} catch (error) {
		console.error("Generate Access Token Error: ", error);
		return null;
	}
};

export const verifyAccessToken = (accessToken) => {
	try {
		const decodedToken = jwt.verify(accessToken, publicKey);
		return decodedToken;
	} catch (error) {
		console.error("Verify Token Error: ", error);
		return null;
	}
};

export const genRefreshToken = (payload) => {
	try {
		const refreshToken = jwt.sign(payload, privateKey, {
			algorithm: "RS256",
			expiresIn: 1000 * 60 * 60 * 24 * 14, // 14 days
		});
		return refreshToken;
	} catch (error) {
		console.error("Generate Refresh Token Error: ", error);
		return null;
	}
};

export const verifyRefreshToken = async (refreshToken) => {
	try {
		console.log("inside verify refresh token: ", refreshToken);
		const decodedToken = jwt.verify(refreshToken, publicKey);
		console.log("inside verify refresh decoded token: ", decodedToken);
		const foundRefreshToken = await getRefreshToken(decodedToken.id);
		console.log("inside verify refresh get refresh token: ", foundRefreshToken);
		return foundRefreshToken;
	} catch (error) {
		console.error("Verify Refresh Token Error: ", error);
		return null;
	}
};
