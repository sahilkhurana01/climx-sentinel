import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_c2V0LWhvcm5ldC0zMy5jbGVyay5hY2NvdW50cy5kZXYk";

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
