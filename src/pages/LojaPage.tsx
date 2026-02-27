import { ShopSection } from "@/components/shop-section";
import type { CartItem } from "@/types/cart";

type Props = { onAddToCart: (item: CartItem) => void };
export default function LojaPage({ onAddToCart }: Props){
  return <ShopSection onAddToCart={onAddToCart} />;
}