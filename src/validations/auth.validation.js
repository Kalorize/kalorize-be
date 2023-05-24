import { z } from "zod";

const login = z.object({
  email: z.string().email(),
  password: z.string(),
});

const register = z.object({
  email: z.string().email(),
  password: z.string(),
  repassword: z.string(),
});

export default { login, register };
