import { z } from "zod";
import { Activity, Gender, Target } from "@prisma/client";

const setup = z.object({
  gender: z.nativeEnum(Gender),
  age: z.number(),
  weight: z.number(),
  height: z.number(),
  activity: z.nativeEnum(Activity),
  target: z.nativeEnum(Target),
});

export default { setup };
