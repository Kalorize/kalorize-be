import express from "express";
import compression from "compression";
import cors from "cors";
import parser from "body-parser";
import helmet from "helmet";
import routes from "../routes/v1/index.js";

const app = express();

// gzip compression
app.use(compression());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// parse body params and attache them to req.body
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

// mount api v1 routes
app.use("/v1", routes);

export default app;
