import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Global Fetch Interceptor to support separate hosting (e.g. on Render)
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

if (API_BASE) {
  const originalFetch = window.fetch;
  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    let url = typeof input === 'string' ? input : input.toString();
    
    // Map relative API and upload routes to the backend base URL
    if (url.startsWith('/api/') || url.startsWith('/uploads/')) {
      url = `${API_BASE}${url}`;
    }

    const response = await originalFetch(url, init);

    // If the response is JSON, recursively rewrite local asset paths
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const clone = response.clone();
      const text = await clone.text();
      try {
        const data = JSON.parse(text);
        
        const rewritePaths = (obj: any): any => {
          if (obj === null || obj === undefined) return obj;
          if (typeof obj === 'string') {
            if (obj.startsWith('/uploads/')) {
              return `${API_BASE}${obj}`;
            }
            return obj;
          }
          if (Array.isArray(obj)) {
            return obj.map(rewritePaths);
          }
          if (typeof obj === 'object') {
            const newObj: any = {};
            for (const key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = rewritePaths(obj[key]);
              }
            }
            return newObj;
          }
          return obj;
        };

        const rewrittenData = rewritePaths(data);
        return new Response(JSON.stringify(rewrittenData), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } catch (e) {
        return response;
      }
    }

    return response;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
