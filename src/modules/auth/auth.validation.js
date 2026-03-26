const { z } = require("zod");

const registerSchema = z.object({
  tenantId: z.string().min(3).max(128),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

const loginSchema = z.object({
  tenantId: z.string().min(3).max(128),
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

const refreshSchema = z.object({
  refreshToken: z.string().min(20).optional()
});

module.exports = { registerSchema, loginSchema, refreshSchema };
