
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  console.log('Received request:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured',
        }), {
        status: 200, // Return 200 to avoid Supabase error handling
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { companyName } = await req.json();
    console.log('Analyzing company:', companyName);

    const prompt = `Analyze the market for ${companyName}. Provide a detailed analysis including:
1. Market Overview
2. Competition Analysis
3. Opportunity Assessment

For each section, include:
- Target users
- Market size and growth
- Entry barriers
- Required key features

Also, identify at least 3 key competitors for ${companyName}. For each competitor, include:
- Their name
- Approximate market share (can be an estimate)
- 3 key strengths
- 2-3 key weaknesses
- Primary markets they operate in
- Year founded (if significant)

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
  }],
  "competitors": [{
    "name": string,
    "marketShare": string,
    "strengths": string[],
    "weaknesses": string[],
    "primaryMarkets": string[],
    "yearFounded": string (optional)
  }]
}

If no direct competitors exist, return an empty array for competitors.`;

    console.log('Making request to OpenAI');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a market research analyst specializing in competitive analysis. Always respond with valid JSON that matches the requested structure exactly.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to get response from OpenAI',
          details: errorData
        }), {
        status: 200, // Return 200 to avoid Supabase error handling
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Received response from OpenAI');
    
    try {
      const analysisText = data.choices[0].message.content;
      console.log('Parsing response:', analysisText);
      const parsedAnalysis = JSON.parse(analysisText);
      
      // Validate the response structure
      if (!parsedAnalysis.analysis || !Array.isArray(parsedAnalysis.analysis)) {
        console.error('Invalid analysis format:', parsedAnalysis);
        throw new Error('Response does not match expected format');
      }

      // Ensure competitors field exists (even if empty)
      if (!parsedAnalysis.competitors) {
        parsedAnalysis.competitors = [];
      }

      console.log('Final response structure:', JSON.stringify({
        analysis: parsedAnalysis.analysis.length,
        competitors: parsedAnalysis.competitors.length
      }));

      return new Response(JSON.stringify(parsedAnalysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse OpenAI response',
          details: parseError.message
        }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in analyze-market function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }), {
      status: 200, // Return 200 to avoid Supabase error handling
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
