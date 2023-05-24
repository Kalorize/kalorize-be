import { env, mysql, port } from "./config/vars.js";
import app from "./config/express.js";
import prisma from "./config/prisma.js";
import logger from "./config/winston.js";

// start database connection
await prisma
  .$connect()
  .then(() => logger.info(`Database connected to ${mysql}`));

// start web server
app.listen(port, () => logger.info(`Server started on port ${port} (${env})`));
