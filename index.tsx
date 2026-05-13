import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import "./index.css";

// Polyfill for navigator.language to prevent internal destructuring errors in some vendor scripts
if (typeof window !== 'undefined' && !window.navigator.language) {
  (window.navigator as any).language = 'en-US';
  (window.navigator as any).languages = ['en-US', 'en'];
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

// Register service worker (only in production or if explicitly enabled)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
} else if (!import.meta.env.PROD && 'serviceWorker' in navigator) {
  // Explicitly unregister sw in development to prevent caching issues
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}
