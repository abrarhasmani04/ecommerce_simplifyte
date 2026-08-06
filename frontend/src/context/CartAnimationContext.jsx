import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

// ─── Context

const CartAnimationContext = createContext(null);

export const useCartAnimation = () => useContext(CartAnimationContext);

// ─── Flying item

const DURATION = 700; // ms

const FlyingItem = ({ src, startRect, onDone }) => {
  const cartIcon = document.getElementById("cart-icon");
  const endRect = cartIcon?.getBoundingClientRect();

  if (!endRect) return null;

  const startX = startRect.left + startRect.width / 2;
  const startY = startRect.top + startRect.height / 2;
  const endX = endRect.left + endRect.width / 2;
  const endY = endRect.top + endRect.height / 2;

  const SIZE = 56;

  return createPortal(
    <img
      src={src}
      alt=""
      aria-hidden="true"
      onAnimationEnd={onDone}
      style={{
        position: "fixed",
        left: startX - SIZE / 2,
        top: startY - SIZE / 2,
        width: SIZE,
        height: SIZE,
        objectFit: "contain",
        borderRadius: "50%",
        border: "2px solid #3b82f6",
        background: "#fff",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        pointerEvents: "none",
        zIndex: 9999,
        "--dx": `${endX - startX}px`,
        "--dy": `${endY - startY}px`,
        animation: `cart-fly ${DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
      }}
    />,
    document.body,
  );
};

// ─── Provider

export const CartAnimationProvider = ({ children }) => {
  const [flights, setFlights] = useState([]); // [{ id, src, startRect }]
  const counter = useRef(0);

  const flyToCart = useCallback((imageSrc, triggerEl) => {
    if (!imageSrc || !triggerEl) return;
    const startRect = triggerEl.getBoundingClientRect();
    const id = ++counter.current;
    setFlights((prev) => [...prev, { id, src: imageSrc, startRect }]);
  }, []);

  const removeFlight = useCallback((id) => {
    setFlights((prev) => prev.filter((f) => f.id !== id));
    // Shake the cart icon badge
    const icon = document.getElementById("cart-icon");
    if (icon) {
      icon.classList.remove("cart-icon-shake");
      void icon.offsetWidth; // reflow to restart animation
      icon.classList.add("cart-icon-shake");
    }
  }, []);

  return (
    <CartAnimationContext.Provider value={{ flyToCart }}>
      {children}
      {flights.map((f) => (
        <FlyingItem
          key={f.id}
          src={f.src}
          startRect={f.startRect}
          onDone={() => removeFlight(f.id)}
        />
      ))}
    </CartAnimationContext.Provider>
  );
};
