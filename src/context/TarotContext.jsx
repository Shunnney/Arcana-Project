import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import tarotApi from "../services/tarotApi";
import { CARDS as FALLBACK_CARDS } from "../data/cards";

const TarotContext = createContext(null);

export function TarotProvider({ children }) {
  const [cards, setCards] = useState(FALLBACK_CARDS);
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  const [error, setError] = useState(null);

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tarotApi.getAllCards();
      if (Array.isArray(data) && data.length > 0) {
        setCards(data);
        setBackendConnected(true);
      }
    } catch (err) {
      console.warn("Backend unavailable, using local fallback cards:", err.message);
      setBackendConnected(false);
      setError(err.message);
      // Keep fallback cards active
      setCards((prev) => (prev.length > 0 ? prev : FALLBACK_CARDS));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const addCard = async (newCardData) => {
    const created = await tarotApi.createCard(newCardData);
    setCards((prev) => [...prev, created]);
    return created;
  };

  const editCard = async (id, updatedData) => {
    const updated = await tarotApi.updateCard(id, updatedData);
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    return updated;
  };

  const deleteCard = async (id) => {
    await tarotApi.deleteCard(id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const getCardBySlug = (slug) => {
    return cards.find((c) => c.slug === slug || String(c.id) === String(slug));
  };

  const getCardById = (id) => {
    return cards.find((c) => c.id === Number(id));
  };

  return (
    <TarotContext.Provider
      value={{
        cards,
        loading,
        error,
        backendConnected,
        refreshCards: fetchCards,
        addCard,
        editCard,
        deleteCard,
        getCardBySlug,
        getCardById,
      }}
    >
      {children}
    </TarotContext.Provider>
  );
}

export function useTarot() {
  const context = useContext(TarotContext);
  if (!context) {
    throw new Error("useTarot must be used within a TarotProvider");
  }
  return context;
}

