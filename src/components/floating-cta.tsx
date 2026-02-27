import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";

type Props = { onClick?: () => void };

export function FloatingCTA({ onClick }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-2xl bg-gold px-5 py-3 font-mono text-sm font-semibold text-deep-blue shadow-lg transition hover:opacity-90"
      aria-label="Comprar ingresso"
    >
      <Ticket className="h-4 w-4" />
      Comprar ingresso
    </button>
  );
}
