import { config } from "dotenv";

// import .env variables
config();

export const env = String(process.env.NODE_ENV);
export const port = Number(process.env.PORT);
export const mysql = String(process.env.MYSQL_URL);
export const jwtSecret = String(process.env.JWT_SECRET);
export const jwtExpired = String(process.env.JWT_EXPIRED);
export const email = String(process.env.EMAIL);
export const email_password = String(process.env.EMAIL_PASSWORD);
export const project = String(process.env.GCP_PROJECT);
export const bucket = String(process.env.GCP_BUCKET);
