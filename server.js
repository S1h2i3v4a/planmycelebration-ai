import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Google Gen AI client securely on the server
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const aiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

app.post('/api/ai-plan', async (req, res) => {
  try {
    const { name, type, date, location, guestCount, theme, totalBudget, currency, priorities } =
      req.body;

    if (!name || !type) {
      return res.status(400).json({
        error: 'Missing required event details (name and type are mandatory).'
      });
    }

    if (!aiClient) {
      return res.status(503).json({
        error: 'AI service is not configured on the server. Please use Demo Mode.'
      });
    }

    const prompt = `You are a senior event planner and UX architect for PlanMyCelebration AI.
Generate a structured, professional event plan for the following celebration:
- Event Name: ${name}
- Event Type: ${type}
- Target Date: ${date || 'Not specified'}
- Location: ${location || 'Not specified'}
- Guest Count: ${guestCount || 100}
- Theme / Style: ${theme || 'Warm Contemporary'}
- Total Budget: ${totalBudget || 500000} ${currency || 'INR'}
- Priorities: ${Array.isArray(priorities) ? priorities.join(', ') : 'None specified'}

Return ONLY a valid JSON object matching this exact schema:
{
  "conceptTitle": "Catchy event subtitle or concept title",
  "executiveSummary": "2-3 sentences describing the overarching atmosphere and guest experience.",
  "themeIdeas": [
    { "title": "Idea 1 title", "description": "Details..." },
    { "title": "Idea 2 title", "description": "Details..." }
  ],
  "preparationPhases": [
    {
      "phase": "Initial Planning",
      "focus": "Key milestone focus...",
      "keyActions": ["Action 1", "Action 2"]
    },
    {
      "phase": "Bookings",
      "focus": "Key milestone focus...",
      "keyActions": ["Action 1", "Action 2"]
    },
    {
      "phase": "Preparation",
      "focus": "Key milestone focus...",
      "keyActions": ["Action 1", "Action 2"]
    },
    {
      "phase": "Final Checks",
      "focus": "Key milestone focus...",
      "keyActions": ["Action 1", "Action 2"]
    }
  ],
  "suggestedActivities": [
    { "title": "Activity 1", "description": "Details..." }
  ],
  "budgetAllocationAdvice": [
    { "category": "Venue & Rentals", "suggestedPct": 25, "rationale": "Why..." }
  ],
  "practicalTips": [
    "Tip 1...",
    "Tip 2..."
  ]
}
Ensure the output is valid JSON without markdown wrapping or backticks.`;

    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-flash-latest',
      'gemini-3.8-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.5-flash'
    ];

    let response = null;
    let lastError = null;

    for (const model of candidateModels) {
      try {
        response = await aiClient.models.generateContent({
          model,
          contents: prompt
        });
        if (response) break;
      } catch (modelErr) {
        console.warn(`Model ${model} attempt failed: ${modelErr.message}. Trying next candidate...`);
        lastError = modelErr;
      }
    }

    if (!response) {
      throw lastError || new Error('All candidate AI models were unavailable.');
    }

    const rawText = typeof response.text === 'function' ? response.text() : response.text;
    // Clean markdown code fences and safely isolate the JSON payload
    const fenceMatch = (rawText || '').match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const candidateJson = fenceMatch ? fenceMatch[1] : rawText;
    const jsonStart = candidateJson.indexOf('{');
    const jsonEnd = candidateJson.lastIndexOf('}');
    const cleanJson =
      jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart
        ? candidateJson.slice(jsonStart, jsonEnd + 1)
        : candidateJson.trim();
    const parsedPlan = JSON.parse(cleanJson);

    return res.json({
      success: true,
      mode: 'live-ai',
      plan: parsedPlan
    });
  } catch (err) {
    console.error('AI Generation Error:', err);
    return res.status(500).json({
      error: 'Failed to generate AI plan. Please check server logs or use Demo Mode.',
      details: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`PlanMyCelebration AI backend running on http://localhost:${PORT}`);
});
