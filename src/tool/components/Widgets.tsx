import { Container } from "semantic-ui-react";

export function Mono({ children }) {
  return <code className="mono">{children}</code>;
}

export function Page({ children }) {
  return <Container className="page">{children}</Container>;
}

export default {
  Mono,
  Page,
};
