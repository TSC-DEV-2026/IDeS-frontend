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
      className="
        fixed z-50 inline-flex items-center justify-center
        bg-gold text-deep-blue shadow-lg transition hover:opacity-90
        rounded-2xl

        /* mobile: só ícone */
        bottom-28 right-4 h-11 w-11

        /* desktop/tablet: botão normal */
        lg:bottom-6 md:right-6 md:h-auto md:w-auto md:px-5 md:py-3 md:gap-2 md:justify-center
        font-mono text-sm font-semibold
      "
      aria-label="Comprar ingresso"
      title="Comprar ingresso"
    >
      <Ticket className="h-5 w-5 md:h-4 md:w-4" />

      {/* aparece só no desktop/tablet */}
      <span className="hidden lg:inline">Comprar ingresso</span>
    </button>
  );
}