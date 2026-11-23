/**
 * API Service for Arcana Tarot Cards (NestJS Backend Integration)
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg =
        (data && (data.message || data.error)) ||
        `HTTP Error ${response.status}: ${response.statusText}`;
      const error = new Error(
        Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      const networkError = new Error(
        `Unable to connect to NestJS backend at ${API_BASE_URL}. Ensure the backend is running.`
      );
      networkError.status = 0;
      throw networkError;
    }
    throw err;
  }
}

export const tarotApi = {
  getBaseUrl() {
    return API_BASE_URL;
  },

  /**
   * GET /api/tarot-cards
   * Retrieve all tarot cards
   */
  async getAllCards() {
    return request("/tarot-cards");
  },

  /**
   * GET /api/tarot-cards/:id
   * Retrieve a single tarot card by ID
   */
  async getCardById(id) {
    return request(`/tarot-cards/${id}`);
  },

  /**
   * POST /api/tarot-cards
   * Create a new tarot card
   */
  async createCard(cardData) {
    return request("/tarot-cards", {
      method: "POST",
      body: JSON.stringify(cardData),
    });
  },

  /**
   * PATCH /api/tarot-cards/:id
   * Update an existing tarot card
   */
  async updateCard(id, cardData) {
    return request(`/tarot-cards/${id}`, {
      method: "PATCH",
      body: JSON.stringify(cardData),
    });
  },

  /**
   * DELETE /api/tarot-cards/:id
   * Delete a tarot card
   */
  async deleteCard(id) {
    return request(`/tarot-cards/${id}`, {
      method: "DELETE",
    });
  },
};

export default tarotApi;

