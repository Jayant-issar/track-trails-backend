import { Context, Next } from "hono";
import { createClerkClient } from '@clerk/backend';

interface Env {
    CLERK_SECRET_KEY: string;
    CLERK_PUBLISHABLE_KEY: string;
    NODE_ENV: string;
}

interface Variables {
    sessionClaims: any; // We'll store all session claims
    isSignedIn: boolean;
}

class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthenticationError";
    }
}

export async function authMiddleware(
    c: Context<{ Bindings: Env; Variables: Variables }>,
    next: Next
) {
    console.log("🟢 Auth middleware started");

    try {
        const clerkClient = createClerkClient({
            secretKey: c.env.CLERK_SECRET_KEY,
            publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
        });

        const authState = await clerkClient.authenticateRequest(
            c.req.raw
        );

        if (!authState.isSignedIn) {
            throw new AuthenticationError("User not signed in");
        }

        // Store the full session claims
        c.set('sessionClaims', authState.toAuth());
        c.set('isSignedIn', authState.isSignedIn);

        console.log("✅ User authenticated:", { 
            auth: authState.toAuth(),
            isSignedIn: authState.isSignedIn 
        });

        await next();
    } catch (error) {
        console.error("🔴 Auth error:", error);

        if (error instanceof AuthenticationError) {
            return c.json({ error: error.message }, 401);
        }
        
        return c.json({ 
            error: "Authentication failed",
            details: c.env.NODE_ENV === 'development' ? error : undefined 
        }, 401);
    }
}

