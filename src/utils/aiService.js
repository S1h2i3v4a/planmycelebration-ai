/**
 * AI Service helper supporting secure backend API calls and
 * clearly labeled offline Demo Mode.
 */

export async function requestAiEventPlan(event) {
  try {
    const res = await fetch('/api/ai-plan', {
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

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${res.status}`);
    }

    const data = await res.json();
    if (!data.success || !data.plan) {
      throw new Error('Invalid response structure received from AI service.');
    }

    return {
      success: true,
      mode: 'live-ai',
      plan: { ...data.plan, isDemo: false, mode: 'live-ai' }
    };
  } catch (err) {
    console.warn(
      'Live AI endpoint unavailable or failed. Falling back to Demo Mode:',
      err.message
    );
    return {
      success: false,
      error: err.message,
      demoPlan: generateDemoAiPlan(event)
    };
  }
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
