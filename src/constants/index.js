// eslint-disable-next-line no-unused-vars
import { Prisma } from "@prisma/client";

/**
 * @type {Prisma.UserInclude}
 */
export const userInclude = {
  reccomendation: {
    include: {
      breakfast: true,
      dinner: true,
      lunch: true,
    },
  },
};
