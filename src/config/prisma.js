import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  errorFormat: "minimal",
  log: [{ emit: "stdout", level: "query" }]
});

export default prisma;
