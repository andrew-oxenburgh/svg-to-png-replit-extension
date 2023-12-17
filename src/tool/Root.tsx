import { HandshakeProvider } from "@replit/extensions-react";
import { createRoot } from "react-dom/client";
import { useReplit } from "@replit/extensions-react";
import IconsFromSvg from "./IconsFromSvg";
function App() {
  const { status, error, replit } = useReplit();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>An error occurred: {error?.message}</div>;
  }

  return <IconsFromSvg />;
}

createRoot(document.getElementById("root")).render(
  <HandshakeProvider>
    <App />
  </HandshakeProvider>,
);
