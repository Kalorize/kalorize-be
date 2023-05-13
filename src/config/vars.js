import { config } from "dotenv";

// import .env variables
config();

export const env = process.env.NODE_ENV;
export const port = process.env.PORT;
export const mysql = process.env.MYSQL_URL;
