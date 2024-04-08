export function ErrorFallback({ error }: { error: Error }) {
  return (
    <div>
      <h2>Algo deu errado.</h2>
      <details style={{ whiteSpace: "pre-wrap" }}>{error.message}</details>
    </div>
  );
}
