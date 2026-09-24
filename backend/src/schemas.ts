import { z } from "zod";

export const loginBodySchema = z.object({
  email: z.string().email("A valid email is required."),
  password: z.string().min(6, "Password must at least be 6 characters."),
});

export const loginSchema = z.object({
  body: loginBodySchema
});

const environments = ['DEVELOPMENT', 'STAGING', 'PRODUCTION'] as const;
const statuses = ['HEALTHY', 'DEGRADED', 'DOWN'] as const;

export const MicroserviceBodySchema = z.object({
  name: z.string().min(3, "Name must at least be 3 characters.").max(60, "Name must not exceed 60 characters."),
  endpointUrl: z.string().optional(),
  environment: z.enum(environments).optional(),
  status: z.enum(statuses).optional(),
  version: z.string().optional()
});

// Create a wrapper schema for our generic Express middleware
export const createServiceSchema = z.object({
  body: MicroserviceBodySchema,
});

export const updateServiceSchema = z.object({
  body: MicroserviceBodySchema.partial(),
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a numeric string"),
  }),
});

// Automatically infer TypeScrip3t types from the Zod schemas
export type ServiceInput = z.infer<typeof MicroserviceBodySchema>;

export const authBodySchema = z.object({
    email: z.string().email("A valid email is required."),
    password: z.string().min(6, "Password must be at least 6 characters.")
});


export const authRequestSchema = z.object({
  body: authBodySchema,
});

export const deleteServiceSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a numeric string"),
  }),
});

export type LoginInput = z.infer<typeof loginBodySchema>;
export type AuthInput = z.infer<typeof authBodySchema>;