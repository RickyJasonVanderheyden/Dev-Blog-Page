import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';

// Initialize Gemini with your key
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export async function chatHandler(req: Request, res: Response) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Try a different model that might have separate quota limits
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    // Handle rate limiting (429 error) with friendly message
    if (error.status === 429 || error.message?.includes('429')) {
      return res.status(429).json({ 
        message: 'Rate limit exceeded. Please wait before trying again.',
        response: '⚠️ Brain overload! I need a 30-second break. Please wait and try again.'
      });
    }
    
    // Handle model not found (404 error) 
    if (error.status === 404 || error.message?.includes('404')) {
      return res.status(404).json({
        message: 'AI Model not found. The model may be deprecated.',
        response: '⚠️ System Error: AI Model unavailable. The developer needs to update the model version.'
      });
    }
    
    // Check if it's an authentication error
    if (error.status === 403) {
      return res.status(403).json({ 
        message: 'API key authentication failed.',
        response: '⚠️ Authentication Error: Please check the API key configuration.'
      });
    }
    
    // Generic error with friendly message
    res.status(500).json({ 
      message: 'Internal server error processing AI request',
      response: 'Sorry, something went wrong on my end. Please try again in a moment.'
    });
  }
}

// Test endpoint to check API key and available models
export async function testApiHandler(req: Request, res: Response) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent("Hello");
    res.json({ status: 'API key is working', test: 'success' });
  } catch (error: any) {
    console.error('API Test Error:', error);
    res.status(500).json({ 
      status: 'API key test failed', 
      error: error.message,
      suggestion: 'Please check if your GEMINI_API_KEY is correct in the .env file'
    });
  }
}