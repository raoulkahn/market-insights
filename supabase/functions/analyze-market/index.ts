
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyName } = await req.json();

    const prompt = `Analyze the market for ${companyName}. Provide a detailed analysis including:
1. Market Overview
2. Competition Analysis
3. Opportunity Assessment

For each section, include:
- Target users
- Market size and growth
- Entry barriers
- Required key features

Format the response as a JSON object with this structure:
{
  "analysis": [{
    "title": string,
    "description": string,
    "marketData": {
      "targetUsers": string[],
      "marketSize": string,
      "entryBarriers": string[],
      "keyFeatures": string[]
    }
  }]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a market research analyst specializing in competitive analysis.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    const parsedAnalysis = JSON.parse(analysisText);

    return new Response(JSON.stringify(parsedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
