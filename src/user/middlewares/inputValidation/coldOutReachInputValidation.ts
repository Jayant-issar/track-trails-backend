import { Context, MiddlewareHandler, Next } from 'hono';
import { z } from 'zod';
import { ColdApproach } from '../../types/coldOutreach';

const coldOutReachSchema = z.object({
    type: z.enum(['email', 'message', 'linkedin_dm']),
    recipientName: z.string().min(1, 'Recipient name is required'),
    company: z.string().min(1, 'Company name is required'),
    content: z.string().min(1, 'Please enter the content of the message you sent the guy'),
    subject: z.string().min(1, 'Please enter the subject of the email you sent the guy').optional(),
    recipientEmail: z.string().email('Please enter a valid email address').optional(),
    linkedinProfile: z.string().url('Please enter a valid LinkedIn profile URL').optional(),
    status: z.enum(['unseen', 'ghosted', 'rejected', 'waiting', 'replied']),
    sentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
})

export const validateColdOutReachInput:MiddlewareHandler = async (c: Context, next: Next) => {
    try {
        const body = await c.req.json() as ColdApproach;
        const validated = coldOutReachSchema.parse(body);
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
            }, 422)
        }
        throw error;
    }
}

