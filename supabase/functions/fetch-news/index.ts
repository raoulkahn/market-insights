
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Initialize a simple in-memory cache
// Note: This cache will reset whenever the function is redeployed
interface CacheItem {
  data: any;
  timestamp: number;
}
const cache: Record<string, CacheItem> = {};
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

// Create a rate limiter for api requests
interface RateLimiter {
  timestamp: number;
  count: number;
}
const rateLimits: Record<string, RateLimiter> = {};
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 100; // Adjust based on your API plan

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
    
    if (!companyName || typeof companyName !== 'string') {
      throw new Error("Invalid or missing company name");
    }
    
    // Create a cache key based on the company name
    const cacheKey = `news_${companyName.toLowerCase()}`;
    
    // Check if we have a valid cached response
    const cachedItem = cache[cacheKey];
    const now = Date.now();
    if (cachedItem && (now - cachedItem.timestamp < CACHE_TTL)) {
      console.log('Returning cached news for:', companyName);
      return new Response(JSON.stringify(cachedItem.data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check rate limits
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = rateLimits[clientIP] || { timestamp: now, count: 0 };
    
    // Reset counter if outside the rate limit window
    if (now - rateLimit.timestamp > RATE_LIMIT_WINDOW) {
      rateLimit.timestamp = now;
      rateLimit.count = 0;
    }
    
    // Check if rate limit is exceeded
    if (rateLimit.count >= MAX_REQUESTS_PER_WINDOW) {
      console.log('Rate limit exceeded for IP:', clientIP);
      
      // Instead of returning an error, return placeholder articles with a flag
      const result = { 
        articles: getDefaultArticles(companyName),
        limitExceeded: true
      };
      
      return new Response(JSON.stringify(result), {
        status: 200, // Return 200 to avoid error handling
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Increment rate limit counter
    rateLimit.count += 1;
    rateLimits[clientIP] = rateLimit;
    
    // Get the API key from Supabase secrets
    const apiKey = Deno.env.get("GNEWS_API_KEY");
    if (!apiKey) {
      throw new Error("GNEWS_API_KEY is not set in Supabase secrets");
    }
    
    // Make request to GNews API
    console.log('Fetching news for:', companyName);
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(companyName)}&lang=en&max=5&apikey=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('GNews API error:', response.status, errorText);
      
      // Return default articles on error to ensure UI always has something to display
      const result = { 
        articles: getDefaultArticles(companyName),
        limitExceeded: errorText.includes("request limit") 
      };
      
      // Cache the default result
      cache[cacheKey] = {
        data: result,
        timestamp: now
      };
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
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
    } else {
      // Add default articles if none were returned
      articles = getDefaultArticles(companyName);
    }
    
    const result = { articles, limitExceeded: false };
    
    // Cache the result
    cache[cacheKey] = {
      data: result,
      timestamp: now
    };
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        articles: getDefaultArticles("current market trends"),
        limitExceeded: false
      }), {
      status: 200, // Return 200 to avoid Supabase error handling
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to generate default articles
function getDefaultArticles(companyName: string) {
  return [
    {
      title: `Latest News on ${companyName}`,
      description: "Check back later for more news updates.",
      url: "https://news.google.com",
      source: "News Service",
      publishedDate: new Date().toISOString()
    },
    {
      title: `${companyName} Industry Trends`,
      description: "Industry analysts are watching developments closely.",
      url: "https://news.google.com",
      source: "Market News",
      publishedDate: new Date().toISOString()
    },
    {
      title: `${companyName} Product Updates`,
      description: "New releases and product updates expected soon.",
      url: "https://news.google.com",
      source: "Tech News",
      publishedDate: new Date().toISOString()
    }
  ];
}
