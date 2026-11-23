import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Link2,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTarot } from "../context/TarotContext";
import TarotCard from "../components/TarotCard";
import SectionHeading from "../components/SectionHeading";

const DEFAULT_IMAGE =
  "https://gfx.tarot.com/images/site/decks/english-magic/full_size/0.jpg";

export default function ManageCards() {
  const {
    cards,
    loading,
    error: apiError,
    backendConnected,
    refreshCards,
    addCard,
    editCard,
    deleteCard,
  } = useTarot();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null); // null = Add, card obj = Edit
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageMode, setImageMode] = useState("url"); // "url" | "upload"
  const [fileName, setFileName] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    numeral: "",
    arcana: "Major Arcana",
    uprightMeaning: "",
    reversedMeaning: "",
    description: "",
    symbolism: "",
    element: "",
    planet: "",
    zodiac: "",
    image: DEFAULT_IMAGE,
    keywords: "",
    quote: "",
  });

  const openAddModal = () => {
    setEditingCard(null);
    setFormError("");
    setFormSuccess("");
    setImageMode("url");
    setFileName("");
    const nextNumber =
      cards.length > 0 ? Math.max(...cards.map((c) => c.number || 0)) + 1 : 22;
    setFormData({
      name: "",
      number: nextNumber,
      numeral: String(nextNumber),
      arcana: "Major Arcana",
      uprightMeaning: "",
      reversedMeaning: "",
      description: "",
      symbolism: "",
      element: "Aether",
      planet: "Cosmos",
      zodiac: "Universal",
      image: `https://gfx.tarot.com/images/site/decks/english-magic/full_size/${nextNumber}.jpg`,
      keywords: "New Archetype, Awakening, Mystery",
      quote: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (card) => {
    setEditingCard(card);
    setFormError("");
    setFormSuccess("");
    if (card.image && card.image.startsWith("data:")) {
      setImageMode("upload");
      setFileName("Uploaded Artwork");
    } else {
      setImageMode("url");
      setFileName("");
    }
    setFormData({
      name: card.name || "",
      number: card.number !== undefined ? card.number : card.id,
      numeral: card.numeral || String(card.id),
      arcana: card.arcana || "Major Arcana",
      uprightMeaning:
        card.uprightMeaning ||
        (Array.isArray(card.upright) ? card.upright.join(", ") : ""),
      reversedMeaning:
        card.reversedMeaning ||
        (Array.isArray(card.reversed) ? card.reversed.join(", ") : ""),
      description: card.description || card.meaning || card.summary || "",
      symbolism: card.symbolism || "",
      element: card.element || "",
      planet: card.planet || "",
      zodiac: card.zodiac || "",
      image: card.image || DEFAULT_IMAGE,
      keywords: Array.isArray(card.keywords)
        ? card.keywords.join(", ")
        : card.keywords || "",
      quote: card.quote || "",
    });
    setModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setFormError("Image file size should be less than 4MB.");
      return;
    }

    setFileName(file.name);
    setFormError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === "string") {
        setFormData((prev) => ({
          ...prev,
          image: dataUrl,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        number: Number(formData.number),
        numeral: formData.numeral.trim() || String(formData.number),
        arcana: formData.arcana.trim() || "Major Arcana",
        uprightMeaning: formData.uprightMeaning.trim(),
        reversedMeaning: formData.reversedMeaning.trim(),
        description: formData.description.trim(),
        symbolism: formData.symbolism.trim(),
        element: formData.element.trim() || "Aether",
        planet: formData.planet.trim() || "Cosmos",
        zodiac: formData.zodiac.trim() || "Universal",
        image: formData.image.trim() || DEFAULT_IMAGE,
        keywords: formData.keywords
          ? formData.keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
          : [],
        quote: formData.quote.trim(),
        summary: formData.description.trim(),
        meaning: formData.description.trim(),
        upright: formData.uprightMeaning
          ? formData.uprightMeaning
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        reversed: formData.reversedMeaning
          ? formData.reversedMeaning
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };

      if (editingCard) {
        await editCard(editingCard.id, payload);
        setFormSuccess(`Card "${payload.name}" updated successfully!`);
      } else {
        await addCard(payload);
        setFormSuccess(`Card "${payload.name}" added to the archive!`);
      }

      setTimeout(() => {
        setModalOpen(false);
      }, 800);
    } catch (err) {
      setFormError(err.message || "Failed to save tarot card.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCard(id);
      setDeleteConfirmId(null);
    } catch (err) {
      alert(`Error deleting card: ${err.message}`);
    }
  };

  const filteredCards = cards.filter((card) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const nameMatch = (card.name || "").toLowerCase().includes(term);
    const numMatch = String(card.number ?? card.id).includes(term);
    const arcanaMatch = (card.arcana || "").toLowerCase().includes(term);
    const kwMatch = Array.isArray(card.keywords)
      ? card.keywords.some((k) => k.toLowerCase().includes(term))
      : false;
    return nameMatch || numMatch || arcanaMatch || kwMatch;
  });

  return (
    <div className="page manage-page">
      <div className="page-wrap">
        <header className="page-header">
          <div>
            <span className="eyebrow">ADMINISTRATION & REST API</span>
            <h1>DECK MANAGER</h1>
            <p>
              Manage the 22 Major Arcana cards with full CRUD operations backed
              by NestJS.
            </p>
          </div>
          <div className="header-decoration" aria-hidden="true">
            ✧
          </div>
        </header>

        {/* Backend Connection Status Badge */}
        <div
          className={`api-status-banner ${
            backendConnected ? "status-connected" : "status-fallback"
          }`}
        >
          <div className="status-indicator">
            <span className="status-dot"></span>
            <strong>
              {backendConnected
                ? "NestJS Backend Connected"
                : "Backend Offline (Local Fallback Active)"}
            </strong>
          </div>
          <span className="status-details">
            {backendConnected
              ? "REST API: http://localhost:3000/api/tarot-cards"
              : "Start NestJS backend: cd backend && npm run start:dev"}
          </span>
          <button
            type="button"
            className="btn-icon-subtle"
            onClick={() => refreshCards()}
            title="Refresh from backend"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
              aria-hidden="true"
            />
            <span>Sync</span>
          </button>
        </div>

        {apiError && !backendConnected && (
          <div className="api-error-alert">
            <AlertCircle size={18} aria-hidden="true" />
            <div>
              <strong>Backend connection notice:</strong> {apiError}
              <br />
              <small>
                Run <code>npm run start:dev</code> in the <code>backend/</code>{" "}
                folder to enable live REST updates.
              </small>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="manage-toolbar">
          <div className="search-box">
            <Search size={16} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search cards by name, number, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            type="button"
            className="btn btn-gold btn-add"
            onClick={openAddModal}
          >
            <Plus size={16} aria-hidden="true" /> Add New Card
          </button>
        </div>

        <div className="manage-meta">
          <span>
            Total Archive: <strong>{cards.length}</strong> cards (showing{" "}
            {filteredCards.length})
          </span>
        </div>

        {/* Cards Table / List */}
        <div className="manage-card-list">
          {filteredCards.map((card) => (
            <div key={card.id} className="manage-card-row">
              <div className="row-preview">
                <TarotCard card={card} className="thumb-tiny" />
                <div className="row-title-block">
                  <span className="row-num">
                    #{card.number !== undefined ? card.number : card.id} ·{" "}
                    {card.numeral || card.number}
                  </span>
                  <h3 className="row-name">
                    <Link to={`/cards/${card.slug || card.id}`}>
                      {card.name}
                    </Link>
                  </h3>
                  <span className="row-arcana">
                    {card.arcana || "Major Arcana"}
                  </span>
                </div>
              </div>

              <div className="row-meta">
                <div className="row-correspondences">
                  {card.element && (
                    <span className="pill pill-element">{card.element}</span>
                  )}
                  {card.planet && (
                    <span className="pill pill-planet">{card.planet}</span>
                  )}
                  {card.zodiac && (
                    <span className="pill pill-zodiac">{card.zodiac}</span>
                  )}
                </div>
                <div className="row-keywords">
                  {(Array.isArray(card.keywords)
                    ? card.keywords
                    : (card.keywords || "").split(",")
                  )
                    .slice(0, 3)
                    .map((kw, i) => (
                      <span key={i} className="kw-tag">
                        {kw.trim()}
                      </span>
                    ))}
                </div>
              </div>

              <div className="row-actions">
                <Link
                  to={`/cards/${card.slug || card.id}`}
                  className="btn-icon"
                  title="View Card Page"
                >
                  <ExternalLink size={16} />
                </Link>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => openEditModal(card)}
                  title="Edit Card (PATCH)"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  type="button"
                  className="btn-icon btn-danger"
                  onClick={() => setDeleteConfirmId(card.id)}
                  title="Delete Card (DELETE)"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Delete confirmation modal */}
              {deleteConfirmId === card.id && (
                <div className="inline-confirm">
                  <span>
                    Delete <strong>{card.name}</strong> from archive?
                  </span>
                  <div className="confirm-btns">
                    <button
                      type="button"
                      className="btn-confirm-yes"
                      onClick={() => handleDelete(card.id)}
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      className="btn-confirm-no"
                      onClick={() => setDeleteConfirmId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredCards.length === 0 && (
            <div className="empty-state">
              <span>✦</span>
              <p>No cards found matching your search.</p>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {modalOpen && (
            <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
              <motion.div
                className="modal-content"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>{editingCard ? "Edit Tarot Card" : "Add Tarot Card"}</h2>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={() => setModalOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                {formError && (
                  <div className="form-alert error">
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                {formSuccess && (
                  <div className="form-alert success">
                    <CheckCircle size={16} />
                    <span>{formSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="card-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="card-name">Card Name *</label>
                      <input
                        id="card-name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="e.g. The Fool, The Star"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="card-number">Card Number *</label>
                      <input
                        id="card-number"
                        type="number"
                        name="number"
                        required
                        min="0"
                        value={formData.number}
                        onChange={handleFormChange}
                        placeholder="e.g. 0, 22"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="card-numeral">Roman Numeral</label>
                      <input
                        id="card-numeral"
                        type="text"
                        name="numeral"
                        value={formData.numeral}
                        onChange={handleFormChange}
                        placeholder="e.g. 0, I, XXII"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="card-arcana">Arcana *</label>
                      <input
                        id="card-arcana"
                        type="text"
                        name="arcana"
                        required
                        value={formData.arcana}
                        onChange={handleFormChange}
                        placeholder="Major Arcana"
                      />
                    </div>
                  </div>

                  {/* Card Artwork: Web URL vs File Upload */}
                  <div className="form-group image-selection-group">
                    <div className="image-label-row">
                      <label>Card Artwork *</label>
                      <div className="image-mode-toggle" role="tablist">
                        <button
                          type="button"
                          role="tab"
                          aria-selected={imageMode === "url"}
                          className={`mode-btn ${imageMode === "url" ? "active" : ""}`}
                          onClick={() => setImageMode("url")}
                        >
                          <Link2 size={13} aria-hidden="true" />
                          <span>Link URL</span>
                        </button>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={imageMode === "upload"}
                          className={`mode-btn ${imageMode === "upload" ? "active" : ""}`}
                          onClick={() => setImageMode("upload")}
                        >
                          <Upload size={13} aria-hidden="true" />
                          <span>Upload File</span>
                        </button>
                      </div>
                    </div>

                    {imageMode === "url" ? (
                      <div className="url-input-wrap">
                        <input
                          id="card-image"
                          type="url"
                          name="image"
                          required
                          value={formData.image}
                          onChange={handleFormChange}
                          placeholder="https://gfx.tarot.com/images/..."
                        />
                      </div>
                    ) : (
                      <div className="upload-input-wrap">
                        <label htmlFor="file-upload-input" className="file-dropzone">
                          <Upload size={20} className="upload-icon" aria-hidden="true" />
                          <span className="upload-title">
                            {fileName ? fileName : "Click to select image file"}
                          </span>
                          <span className="upload-sub">Supports PNG, JPG, GIF, WEBP (Max 4MB)</span>
                        </label>
                        <input
                          id="file-upload-input"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden-file-input"
                        />
                      </div>
                    )}

                    {/* Artwork Thumbnail Preview */}
                    {formData.image && (
                      <div className="artwork-preview-row">
                        <img
                          src={formData.image}
                          alt="Artwork Preview"
                          className="preview-thumbnail"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          onLoad={(e) => {
                            e.currentTarget.style.display = "block";
                          }}
                        />
                        <div className="preview-meta">
                          <span className="preview-title">Artwork Preview</span>
                          <span className="preview-src">
                            {imageMode === "url"
                              ? (formData.image.length > 55 ? `${formData.image.slice(0, 55)}...` : formData.image)
                              : (fileName || "Local Image Data URL")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="card-element">Element</label>
                      <input
                        id="card-element"
                        type="text"
                        name="element"
                        value={formData.element}
                        onChange={handleFormChange}
                        placeholder="e.g. Air, Water, Fire, Earth"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="card-planet">Planet</label>
                      <input
                        id="card-planet"
                        type="text"
                        name="planet"
                        value={formData.planet}
                        onChange={handleFormChange}
                        placeholder="e.g. Uranus, Mercury, Moon"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="card-zodiac">Zodiac</label>
                      <input
                        id="card-zodiac"
                        type="text"
                        name="zodiac"
                        value={formData.zodiac}
                        onChange={handleFormChange}
                        placeholder="e.g. Aquarius, Aries"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="card-keywords">
                      Keywords (comma-separated)
                    </label>
                    <input
                      id="card-keywords"
                      type="text"
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleFormChange}
                      placeholder="e.g. Beginnings, Innocence, Leap of faith"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="card-upright">Upright Meaning *</label>
                    <textarea
                      id="card-upright"
                      name="uprightMeaning"
                      required
                      rows="2"
                      value={formData.uprightMeaning}
                      onChange={handleFormChange}
                      placeholder="Positive keywords or description when upright..."
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="card-reversed">Reversed Meaning *</label>
                    <textarea
                      id="card-reversed"
                      name="reversedMeaning"
                      required
                      rows="2"
                      value={formData.reversedMeaning}
                      onChange={handleFormChange}
                      placeholder="Shadow keywords or description when reversed..."
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="card-description">
                      Description / Core Meaning *
                    </label>
                    <textarea
                      id="card-description"
                      name="description"
                      required
                      rows="3"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Comprehensive esoteric meaning of the archetype..."
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="card-symbolism">Symbolism</label>
                    <textarea
                      id="card-symbolism"
                      name="symbolism"
                      rows="2"
                      value={formData.symbolism}
                      onChange={handleFormChange}
                      placeholder="Key symbols depicted on the card artwork..."
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="card-quote">Inspirational Quote</label>
                    <input
                      id="card-quote"
                      type="text"
                      name="quote"
                      value={formData.quote}
                      onChange={handleFormChange}
                      placeholder="e.g. As above, so below..."
                    />
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn btn-modal-cancel"
                      onClick={() => setModalOpen(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-gold"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />{" "}
                          Saving...
                        </>
                      ) : editingCard ? (
                        "Save Changes (PATCH)"
                      ) : (
                        "Create Card (POST)"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

