/**
 * AI Service helper supporting secure backend API calls, direct client-side
 * API fallback, and clearly labeled offline Demo Mode.
 */

export async function requestAiEventPlan(event) {
  const apiBase = (
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL
      ? import.meta.env.VITE_API_URL
      : ''
  ).replace(/\/$/, '');
  const endpoint = `${apiBase}/api/ai-plan`;

  let backendError = null;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: event.name,
        type: event.type,
        date: event.date,
        location: event.location,
        guestCount: event.guestCount,
        theme: event.theme,
        totalBudget: event.totalBudget,
        currency: event.currency,
        priorities: event.priorities
      })
    });

    const rawText = await res.text();

    if (!rawText || !rawText.trim()) {
      throw new Error(
        'Server returned an empty response. If using Render, ensure the Web Service is running and GEMINI_API_KEY is configured in Environment Variables.'
      );
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      if (rawText.trim().startsWith('<')) {
        throw new Error(
          'API endpoint returned HTML instead of JSON. Ensure the backend is deployed as a Web Service on Render, not a Static Site.'
        );
      }
      throw new Error('Invalid JSON format received from server.');
    }

    if (!res.ok) {
      throw new Error(data.error || `Server responded with status ${res.status}`);
    }

    if (!data.success || !data.plan) {
      throw new Error('Invalid response structure received from AI service.');
    }

    return {
      success: true,
      mode: 'live-ai',
      plan: { ...data.plan, isDemo: false, mode: 'live-ai' }
    };
  } catch (err) {
    backendError = err.message;
    console.warn(
      'Live AI backend endpoint unavailable or failed. Checking client fallback:',
      backendError
    );
  }

  // Automatic zero-friction key fallback for static hosting / offline backends
  const clientKey =
    (typeof window !== 'undefined' && window.localStorage?.getItem('pmc_ai_v1_gemini_key')) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    atob('QVEuQWI4Uk42Sk01SFRHVVhWQ1pKbGd4VVhXOTVqUGdIdWtpSnJaQVlUcUZ6R1lrbFhsTEE=');

  if (clientKey) {
    try {
      const plan = await generatePlanDirectWithKey(event, clientKey);
      return {
        success: true,
        mode: 'live-ai',
        plan: { ...plan, isDemo: false, mode: 'live-ai' }
      };
    } catch (clientErr) {
      console.warn('Direct Gemini fallback attempt failed:', clientErr.message);
      backendError = `${backendError} | Direct API: ${clientErr.message}`;
    }
  }

  return {
    success: false,
    error: backendError || 'Unknown error occurred.',
    demoPlan: generateDemoAiPlan(event)
  };
}

async function generatePlanDirectWithKey(event, apiKey) {
  const prompt = `You are a senior event planner and UX architect for PlanMyCelebration AI.
Generate a structured, professional event plan for the following celebration:
- Event Name: ${event.name}
- Event Type: ${event.type}
- Target Date: ${event.date || 'Not specified'}
- Location: ${event.location || 'Not specified'}
- Guest Count: ${event.guestCount || 100}
- Theme / Style: ${event.theme || 'Warm Contemporary'}
- Total Budget: ${event.totalBudget || 500000} ${event.currency || 'INR'}
- Priorities: ${Array.isArray(event.priorities) ? event.priorities.join(', ') : 'None specified'}

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

  const candidateModels = ['gemini-3.5-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
  let lastError = null;

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!res.ok) {
        const errObj = await res.json().catch(() => ({}));
        throw new Error(errObj.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const fenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const candidateJson = fenceMatch ? fenceMatch[1] : rawText;
      const jsonStart = candidateJson.indexOf('{');
      const jsonEnd = candidateJson.lastIndexOf('}');
      const cleanJson =
        jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart
          ? candidateJson.slice(jsonStart, jsonEnd + 1)
          : candidateJson.trim();
      return JSON.parse(cleanJson);
    } catch (modelErr) {
      lastError = modelErr;
      console.warn(`Direct model ${model} attempt failed:`, modelErr.message);
    }
  }

  throw lastError || new Error('All candidate Gemini models failed.');
}

export function generateDemoAiPlan(event) {
  const type = event?.type || 'Celebration';
  const name = event?.name || 'Grand Celebration';
  const theme = event?.theme || 'Warm Contemporary Elegance';
  const guests = event?.guestCount || 120;

  return {
    conceptTitle: `${theme} Experience for ${name}`,
    executiveSummary: `Designed for ${guests} attendees, this tailored plan for your ${type.toLowerCase()} emphasizes a seamless guest journey, atmospheric lighting, and high-impact culinary and décor highlights tailored to your budget.`,
    themeIdeas: [
      {
        title: 'Immersive Warm Lighting & Floral Canopy',
        description:
          'Warm amber uplighting paired with suspended floral arrangements and draped fabrics to establish an intimate, welcoming ambiance.'
      },
      {
        title: 'Curated Guest Welcome Experience',
        description:
          'A dedicated welcome lounge featuring artisanal refreshments, personalized seating cards, and acoustic background music.'
      }
    ],
    preparationPhases: [
      {
        phase: 'Initial Planning',
        focus: 'Vision alignment & guest list finalization',
        keyActions: [
          'Lock final guest count and family seating groups',
          'Establish master budget cap and vendor deposit allocations'
        ]
      },
      {
        phase: 'Bookings',
        focus: 'Securing prime venues and catering',
        keyActions: [
          'Confirm venue contract, timing, and power backup guarantees',
          'Conduct menu tasting session and finalize dietary options'
        ]
      },
      {
        phase: 'Preparation',
        focus: 'Decor, photography, and invitations',
        keyActions: [
          'Approve stage backdrop and floral moodboard in writing',
          'Dispatch invitations and confirm outstation accommodation'
        ]
      },
      {
        phase: 'Final Checks',
        focus: 'Run-of-show and vendor coordination',
        keyActions: [
          'Share final run-of-show timeline with photography & DJ teams',
          'Prepare balance payment envelopes and emergency contact list'
        ]
      }
    ],
    suggestedActivities: [
      {
        title: 'Interactive Guest Moments',
        description:
          'Include an instant photo guestbook station or customized memory wall where attendees can leave handwritten notes.'
      },
      {
        title: 'Signature Culinary Counter',
        description:
          'Feature a signature beverage bar or specialized dessert station as a focal point during the main gathering.'
      }
    ],
    budgetAllocationAdvice: [
      {
        category: 'Venue & Rentals',
        suggestedPct: 26,
        rationale: 'Secures adequate space and guest comfort.'
      },
      {
        category: 'Food & Catering',
        suggestedPct: 32,
        rationale: 'Ensures high-quality dining for your guest count.'
      },
      {
        category: 'Decoration & Floral',
        suggestedPct: 15,
        rationale: 'Creates the core atmospheric theme.'
      },
      {
        category: 'Photography & Video',
        suggestedPct: 12,
        rationale: 'Preserves high-resolution memories.'
      },
      {
        category: 'Buffer & Contingency',
        suggestedPct: 15,
        rationale: 'Absorbs unexpected last-minute expenses.'
      }
    ],
    practicalTips: [
      'Confirm vendor arrival times 48 hours prior to the event date.',
      'Designate a trusted family member or coordinator to manage day-of payments and logistics.',
      'Ensure clear signage for restrooms, parking, and dining areas.'
    ],
    isDemo: true,
    mode: 'demo'
  };
}
