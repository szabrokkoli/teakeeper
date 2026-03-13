import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import App from "./App.jsx";
import "./styles/tokens.css";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AuthProvider>
);