import { HandshakeProvider } from "@replit/extensions-react";
import { createRoot } from "react-dom/client";
import { useReplit } from "@replit/extensions-react";

function App() {
  const { status, error, replit } = useReplit();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>An error occurred: {error?.message}</div>;
  }

  return <div>Extension is Ready!</div>;
}

createRoot(document.getElementById("root")).render(
  <HandshakeProvider>
    <App />
  </HandshakeProvider>
);

render(<Component />, document.getElementById("root") as Element);

