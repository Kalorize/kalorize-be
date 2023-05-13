// make bluebird default Promise
import { env, mysql, port } from "./config/vars.js";
import app from "./config/express.js";
import prisma from "./config/prisma.js";

// start database connection
await prisma
  .$connect()
  .then(() => console.log(`Database connected to ${mysql}`));

// start web server
app.listen(port, () => console.log(`Server started on port ${port} (${env})`));
