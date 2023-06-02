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

export default { update };
