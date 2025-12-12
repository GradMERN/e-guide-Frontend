import { useEffect } from "react";

/**
 * Custom hook that detects clicks outside of a referenced element
 * Useful for closing dropdowns, modals, tooltips, etc.
 * @param {React.RefObject} ref - The ref of the element to detect outside clicks
 * @param {Function} handler - The callback function to run when clicking outside
 * @param {boolean} enabled - Whether the hook is enabled (default: true)
 */
function useOnClickOutside(ref, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    // Listen for both mouse and touch events
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
}

export default useOnClickOutside;
