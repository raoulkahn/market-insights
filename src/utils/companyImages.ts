
// A mapping of company names to their product images
const companyProductImages: Record<string, string> = {
  "Tesla": "https://images.unsplash.com/photo-1562053342-7280b39e696c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
  "Apple": "https://images.unsplash.com/photo-1621768216002-5ac201876625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aVBob25lfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80",
  "Microsoft": "https://images.unsplash.com/photo-1640552435936-5a6c5824e3c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWljcm9zb2Z0JTIwc3VyZmFjZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80",
  "Amazon": "https://images.unsplash.com/photo-1614398981229-f9662cc67e3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QW1hem9uJTIwYm94fGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80",
  "Google": "https://images.unsplash.com/photo-1611497368888-21b9b4a8da68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z29vZ2xlJTIwcGl4ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1200&q=80",
  "Facebook": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFjZWJvb2slMjBhcHB8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1200&q=80",
  "Instagram": "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW5zdGFncmFtfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80",
  "TikTok": "https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGlrdG9rfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80",
  "Twitter": "https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHdpdHRlciUyMGFwcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80",
  "Netflix": "https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmV0ZmxpeCUyMHNjcmVlbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80",
  "Uber": "https://images.unsplash.com/photo-1588356536984-f7ece5dca3bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dWJlciUyMGNhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80",
  "Airbnb": "https://images.unsplash.com/photo-1542295669297-4d352b042bca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWlyYm5ifGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80",
  "Spotify": "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BvdGlmeSUyMGFwcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80",
  "Samsung": "https://images.unsplash.com/photo-1659947631294-cabf96f6716f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2Ftc3VuZyUyMHBob25lfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80",
  "IBM": "https://images.unsplash.com/photo-1680702944205-657ed24cc864?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aWJtJTIwY29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1200&q=80",
  "Intel": "https://images.unsplash.com/photo-1628506484913-5738657a93f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW50ZWwlMjBjaGlwfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80",
  "Oracle": "https://images.unsplash.com/photo-1590462817667-c48e199e9c6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2VydmVyJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80",
  "Coca-Cola": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvY2ElMjBjb2xhfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80",
  "Nike": "https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bmlrZSUyMHNob2VzfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80",
  "Adidas": "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFkaWRhcyUyMHNob2VzfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80",
};

// Fallback image for companies not in our list
const fallbackImage = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1200&q=80";

/**
 * Get a product image URL for a company
 * @param companyName The name of the company
 * @returns URL to an image representing the company's product
 */
export const getCompanyProductImage = (companyName: string): string => {
  if (!companyName) return fallbackImage;
  
  // Try to find an exact match first (case insensitive)
  const normalizedCompanyName = companyName.toLowerCase();
  
  for (const [key, value] of Object.entries(companyProductImages)) {
    if (key.toLowerCase() === normalizedCompanyName) {
      return value;
    }
  }
  
  // Try to find a partial match (case insensitive)
  for (const [key, value] of Object.entries(companyProductImages)) {
    if (normalizedCompanyName.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedCompanyName)) {
      return value;
    }
  }
  
  // Return fallback image if no match is found
  return fallbackImage;
};
