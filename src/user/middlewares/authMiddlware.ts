import { Context, Next } from "hono";
import { createRemoteJWKSet, jwtVerify } from "jose";

interface Env {
    CLERK_JWT_ISSUER: string;
    CLERK_JWKS_URL: string;
}

interface Variables {
    sessionClaims: Record<string, unknown>;
    isSignedIn: boolean;
}

export async function authMiddleware(c: Context<{ Bindings: Env; Variables: Variables }>, next: Next) {
    console.log("🟢 The auth middleware is running");
    try {
        const authHeader = c.req.header('Authorization');
        const token = authHeader?.split(' ')[1];
        
        if (!token) {
            return c.json({ error: "Authorization token required" }, 401);
        }

        // Get Clerk JWKS
        const JWKS = createRemoteJWKSet(new URL(c.env.CLERK_JWKS_URL));
        
        // Verify JWT
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: c.env.CLERK_JWT_ISSUER
        });

        // Set session claims
        c.set('sessionClaims', payload);
        c.set('isSignedIn', true);
        console.log("🟢 The auth middleware run successfully");
        return await next();
    } catch (error) {
        console.error("Auth error:", error);
        return c.json({ error: "Invalid or expired token" }, 401);
    }
}

