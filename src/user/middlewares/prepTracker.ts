import { Context, MiddlewareHandler, Next } from 'hono';
import { z } from 'zod';
import { PreparationMetric } from '../types/prepTracker';

const createPrepMetricSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    targetPerDay: z.object({
        value: z.number().min(1, 'Value is required'),
        label: z.string().min(1, 'Label is required'),
    }),
    progress: z.array(z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
        achieved: z.number().min(0, 'Achieved is required'),
    })).optional()
})

export const validatePrepMetricInput:MiddlewareHandler = async (c:Context, next:Next) => {
    try {
        const body = await c.req.json() as PreparationMetric;
        const validated = createPrepMetricSchema.parse(body);

        c.set('validatedData', validated);
        await next();
    } catch (error) {
        if(error instanceof z.ZodError){
            return c.json({
                success: false,
                errors: error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
            },422)
        }
        throw error;

    }
}