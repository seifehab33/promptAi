import { useState, useEffect } from "react";

export function usePuterSDK() {
  const [isReady, setIsReady] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const checkSDK = () => {
      if (typeof window !== "undefined" && window.puter && window.puter.ai) {
        setIsReady(true);
      } else {
        // Retry after a short delay
        setTimeout(checkSDK, 100);
      }
    };

    checkSDK();
  }, []);

  return isClient && isReady;
}
