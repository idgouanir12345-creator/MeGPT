import axios from 'axios';

class WebSearchService {
  constructor() {
    this.apiKey = process.env.WEB_SEARCH_API_KEY;
    this.baseUrl = 'https://api.search.com';
  }

  async search(query, options = {}) {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'Web Search API key not configured',
        message: 'To enable web search, add WEB_SEARCH_API_KEY to your .env file'
      };
    }

    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          q: query,
          num: options.results || 10,
          ...options
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return {
        success: true,
        results: response.data.results,
        query: query
      };
    } catch (error) {
      console.error('Web Search Error:', error.message);
      return {
        success: false,
        error: error.message,
        suggestion: 'Configure WEB_SEARCH_API_KEY in .env file'
      };
    }
  }

  async searchNews(query, options = {}) {
    // Similar to search but for news results
    return this.search(query, { ...options, type: 'news' });
  }

  async searchImages(query, options = {}) {
    // Search for images
    return this.search(query, { ...options, type: 'images' });
  }
}

export const webSearchService = new WebSearchService();
