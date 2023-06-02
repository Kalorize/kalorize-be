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

const choose = z.object({
  breakfast: z.object({
    RecipeId: z.number()
  }),
  lunch: z.object({
    RecipeId: z.number()
  }),
  dinner: z.object({
    RecipeId: z.number()
  }),
  date: z.coerce.date().optional(),
})

const food = z.object({
  RecipeId: z.number()
})
export default { update, choose, food };
