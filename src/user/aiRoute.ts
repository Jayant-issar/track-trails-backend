import { Hono } from "hono";
import { GoogleGenerativeAI } from '@google/generative-ai'

// Add type definition for Cloudflare Bindings
type Bindings = {
  GEMINI_API_KEY: string
}

// Update Hono initialization with type parameter
export const aiRouteApp = new Hono<{ Bindings: Bindings }>();

aiRouteApp.get("/", async (c) => {
    return c.text("welcome to the ai route")
})

aiRouteApp.post('/ai-help', async (c) => {
    const { prompt, context } = await c.req.json();
  
    if (!prompt || !context) {
      return c.json({ error: 'Missing prompt or context' }, 400, { 'Content-Type': 'application/json' });
    }
  
    try {
      const genAI = new GoogleGenerativeAI(c.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // Or 'gemini-pro-vision' if dealing with images
  
      const formattedPrompt = `Act as a career coach specializing in ${context}. Provide a concise, actionable response to this query: ${prompt}`;
  
  
      const result = await model.generateContent(formattedPrompt);  // Pass the formatted prompt
  
      const response = result.response;
  
      if (!response) {
          console.error("Gemini API returned an empty response.");
          return c.json({ error: 'Gemini API returned an empty response' }, 500);
      }
  
      const text = response.text();
  
  
      return c.json({
        text,
        meta: {
          model: 'gemini-pro',
          context,
          timestamp: new Date().toISOString()
        }
      }, 200, {
        'Content-Type': 'application/json'
      });
  
    } catch (error) {
      console.error('AI Help Error:', error);
      return c.json(
        { error: 'Failed to generate response', details: error },
        500,
        { 'Content-Type': 'application/json' }
      );
    }
  })