import { z } from "zod";
import { Activity, Gender, Target } from "@prisma/client";

const update = z.object({
  gender: z.nativeEnum(Gender).optional(),
  age: z.number().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
  password: z.string().min(8).optional(),
  activity: z.nativeEnum(Activity).optional(),
  target: z.nativeEnum(Target).optional(),
});

const foodSchema = z.object({
  RecipeId: z.number()
})
const choose = z.object({
  breakfast: foodSchema,
  lunch: foodSchema,
  dinner: foodSchema,
  date: z.coerce.date().optional(),
})

export default { update, choose };
