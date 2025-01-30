import { Hono } from "hono";
import { authMiddleware } from "../middlewares/authMiddlware";
import { createClerkClient } from "@clerk/backend";

const testApp = new Hono();
testApp.get('/', authMiddleware, async (c) => {
    const sessionClaims = c.get('sessionClaims');
    
    const clerkClient = createClerkClient({
        secretKey: c.env.CLERK_SECRET_KEY,
        publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
    });

    try {
        const user = await clerkClient.users.getUser(sessionClaims.userId);
        
        return c.json({
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl
        });
    } catch (error) {
        return c.json({ error: "Failed to fetch user data" }, 500);
    }
});

export default testApp;