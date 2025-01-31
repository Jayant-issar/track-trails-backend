import { z } from 'zod';
import { type MiddlewareHandler } from 'hono';
import { ApplicationStatus, ApplicationMethod } from '../../types/application';

const applicationSchema = z.object({
    companyName: z.string().min(1, 'Company name is required'),
    position: z.string().min(1, 'Position is required'),
    status: z.enum([
      'accepted', 
      'waiting', 
      'ghosting', 
      'rejected', 
      'interviewing'
    ] as const),
    method: z.enum([
      'email', 
      'website', 
      'linkedin', 
      'referral', 
      'other'
    ] as const),
    appliedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
    notes: z.string().optional(),
    contactEmail: z.string().email().optional(),
    contactName: z.string().optional()
});

export const validateApplication: MiddlewareHandler = async (c, next) => {
  try {
    const body = await c.req.json();
    const validated = applicationSchema.parse(body);
    c.set('validatedData', validated);
    await next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      }, 400);
    }
    return c.json({ success: false, message: 'Invalid request' }, 400);
  }
};