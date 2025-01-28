// this file contains the middleware for the on boarding process of the input validation

import { z } from "zod";
import { Context } from "hono";
import { queryParamsSchema, userCreateSchema } from "../schemas/onBoardingSchemas";

export const validateOnBoardingInput = async (c: Context, next: any) => {
    try {
        // Validate clerkId separately first
        const clerkId = c.req.query('clerkId');
        if (!clerkId) {
            return c.json({
                success: false,
                message: 'Validation failed',
                error: 'clerkId is required in query parameters'
            }, 400);
        }

        let validatedQuery;
        try {
            validatedQuery = queryParamsSchema.parse({ clerkId });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return c.json({
                    success: false,
                    message: 'Query parameter validation failed',
                    errors: error.errors.map(err => ({
                        field: err.path.join('.'),
                        error: err.message
                    }))
                }, 400);
            }
            throw error;
        }

        // Then validate body
        let body;
        try {
            body = await c.req.json();
        } catch (error) {
            return c.json({
                success: false,
                message: 'Invalid JSON in request body',
                error: 'Request body must be valid JSON'
            }, 400);
        }

        let validatedBody;
        try {
            validatedBody = userCreateSchema.parse(body);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return c.json({
                    success: false,
                    message: 'Request body validation failed',
                    errors: error.errors.map(err => ({
                        field: err.path.join('.'),
                        error: err.message
                    }))
                }, 400);
            }
            throw error;
        }

        // If all validations pass, set the validated input
        c.set("validatedInput", {
            clerkId: validatedQuery.clerkId,
            ...validatedBody
        });

        await next();
    } catch (error) {
        console.error('Validation error:', error);
        return c.json({
            success: false,
            message: 'Internal server error during validation',
            error: 'Please try again later'
        }, 500);
    }
};
