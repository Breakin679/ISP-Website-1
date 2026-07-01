import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    // strip the leading “#”
    const id = hash.substring(1);

    const attemptScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        // try again on next animation frame
        requestAnimationFrame(attemptScroll);
      }
    };

    requestAnimationFrame(attemptScroll);
  }, [hash]);
}
