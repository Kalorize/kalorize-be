import { z } from "zod";
import { Activity, Gender, Target } from "@prisma/client";

const update = z.object({
  gender: z.nativeEnum(Gender).optional(),
  name: z.string().optional(),
  age: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  password: z.string().min(8).optional(),
  activity: z.nativeEnum(Activity).optional(),
  target: z.nativeEnum(Target).optional(),
});

const foodSchema = z.object({
  id: z.number()
});
const choose = z.object({
  breakfast: foodSchema,
  lunch: foodSchema,
  dinner: foodSchema,
  date: z.coerce.date().optional().default(new Date()),
});

const getFood = z.object({
  date: z.coerce.date()
});

export default { update, choose, getFood };
