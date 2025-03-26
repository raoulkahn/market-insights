
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// This function uses the GNews API (https://gnews.io/)
// For a real implementation, you would need to register and use your own API key
// You can sign up for a free tier at https://gnews.io/
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { companyName } = await req.json();
    
    // Example: Using GNews API (free tier)
    // In production, you'd use an API key stored in Supabase secrets
    const apiKey = "demo"; // Replace with your real API key
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(companyName)}&lang=en&max=2&apikey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Transform the data to match our expected format
    let articles = [];
    
    if (data.articles && data.articles.length > 0) {
      articles = data.articles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedDate: article.publishedAt
      }));
    }
    
    return new Response(JSON.stringify({ articles }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        articles: [] 
      }), {
      status: 200, // Return 200 to avoid Supabase error handling
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
