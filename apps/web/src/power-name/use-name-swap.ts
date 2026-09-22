import { useState } from "react";

export const useNameSwap = () => {
  const [swapped, setSwapped] = useState(false);
  return {
    hoverProps: {
      onBlur: () => setSwapped(false),
      onFocus: () => setSwapped(true),
      onMouseEnter: () => setSwapped(true),
      onMouseLeave: () => setSwapped(false),
    },
    swapped,
  };
};
