import { TicketsSection } from "@/components/tickets-section";
import type { CartItem } from "@/types/cart";

type Props = { onCheckoutAdd: (item: CartItem) => void };
export default function IngressosPage({ onCheckoutAdd }: Props){
  return <TicketsSection onCheckoutAdd={onCheckoutAdd} />;
}