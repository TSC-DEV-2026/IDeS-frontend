import * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      richColors
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast flex w-full max-w-sm items-start gap-3 rounded-xl border bg-popover/95 p-4 text-popover-foreground shadow-lg backdrop-blur supports-[backdrop-filter]:bg-popover/85",
          title: "text-sm font-semibold leading-none tracking-tight",
          description: "text-sm text-muted-foreground leading-snug",

          // ✅ só mudei as CORES dos botões (resto igual)
          // Excluir: vermelho “real”, com hover levemente mais claro
          actionButton:
            "inline-flex h-9 items-center !bg-red-500 justify-center rounded-lg bg-red-600 px-3 text-sm font-medium !text-white transition-colors hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ring-offset-background",

          // Cancelar: cinza mais escuro/bonito (não fica “lavado”)
          cancelButton:
            "inline-flex h-9 items-center justify-center rounded-lg !bg-zinc-700 px-3 text-sm font-medium !text-white transition-colors hover:bg-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 ring-offset-background",

          closeButton:
            "rounded-md p-1 text-muted-foreground/80 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}