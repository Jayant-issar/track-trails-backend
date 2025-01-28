// this file contains the custom error handler middleware
import { HTTPException } from "hono/http-exception";
import { z } from "zod";


const errorHandler = async (err: Error, c: any) => {
    if (err instanceof z.ZodError) {
        return c.json({
            success: false,
            message: "Validation failed",
            errors: err.errors,
        }, 400);
    }

    if (err instanceof HTTPException) {
        return c.json({
            success: false,
            message: err.message,
        }, err.status);
    }

    console.error("Unexpected error:", err);
    return c.json({
        success: false,
        message: "Internal server error",
    }, 500);
};