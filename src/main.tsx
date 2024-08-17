import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
const qc = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <Toaster
        toastOptions={{
          classNames: {
            toast: "border-neutral-700 bg-neutral-800 p-3 border",
            title: "text-neutral-100",
            icon: "text-neutral-100",
          },
        }}
      />
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
