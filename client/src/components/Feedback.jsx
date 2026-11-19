export default function Feedback({ feedback }) {
  if (!feedback) return null;

  return (
    <div className={`feedback feedback--${feedback.tipo}`} role="status" aria-live="polite">
      {feedback.mensagem}
    </div>
  );
}
