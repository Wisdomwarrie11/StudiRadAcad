import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

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