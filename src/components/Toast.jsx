import React, { useState, useEffect, useRef } from "react";
import { setToastListener } from "../utils/toast";
import "./Toast.css";

const AUTO_DISMISS_MS = 4000;

export default function Toast() {
  const [toasts, setToasts] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    setToastListener((t) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, AUTO_DISMISS_MS);
    });
    return () => setToastListener(null);
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((x) => x.id !== id));

  return (
    <div ref={ref} className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast--${t.type}`}
          role="alert"
          onClick={() => remove(t.id)}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
