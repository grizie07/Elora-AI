import { useEffect } from "react";

/**
 * Themed modal — replaces native confirm() / alert() dialogs.
 *
 * Props:
 *   isOpen      – boolean
 *   type        – "danger" | "info" | "warning"  (controls colour)
 *   icon        – emoji / character shown in the circle
 *   title       – bold heading
 *   message     – body text
 *   confirmLabel – label for the primary button (default "Confirm")
 *   cancelLabel  – label for the cancel button; omit to hide it
 *   onConfirm   – called when primary button clicked
 *   onCancel    – called when cancel clicked or backdrop clicked
 */
const palette = {
  danger:  { accent: "#EF4444", accentBg: "rgba(239,68,68,0.15)",  accentBorder: "rgba(239,68,68,0.3)",  btn: "linear-gradient(135deg,#EF4444,#DC2626)" },
  warning: { accent: "#F59E0B", accentBg: "rgba(245,158,11,0.15)", accentBorder: "rgba(245,158,11,0.3)", btn: "linear-gradient(135deg,#F59E0B,#D97706)" },
  info:    { accent: "#6366F1", accentBg: "rgba(99,102,241,0.15)", accentBorder: "rgba(99,102,241,0.3)",  btn: "linear-gradient(135deg,#6366F1,#7C3AED)" },
};

const Modal = ({
  isOpen,
  type = "info",
  icon,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const p = palette[type] || palette.info;

  return (
    // Backdrop
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
        animation: "fadeIn 0.15s ease-out",
      }}
    >
      {/* Card — stop click propagating to backdrop */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1C2333",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 20,
          padding: "32px 28px 24px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          animation: "slideUp 0.18s ease-out",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Icon circle */}
        {icon && (
          <div style={{
            width: 56, height: 56, borderRadius: "50%", margin: "0 auto 18px",
            background: p.accentBg, border: `1px solid ${p.accentBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26,
          }}>
            {icon}
          </div>
        )}

        {/* Title */}
        {title && (
          <h2 style={{ textAlign: "center", fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            {title}
          </h2>
        )}

        {/* Message */}
        {message && (
          <p style={{ textAlign: "center", fontSize: 13, color: "#9CA3AF", lineHeight: 1.6, marginBottom: 24 }}>
            {message}
          </p>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          {cancelLabel && onCancel && (
            <button
              onClick={onCancel}
              style={{
                flex: 1, padding: "11px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", color: "#9CA3AF",
                fontSize: 14, fontWeight: 500, cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "11px", borderRadius: 12, border: "none",
              background: p.btn, color: "#fff",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              transition: "opacity 0.15s",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
};

export default Modal;
