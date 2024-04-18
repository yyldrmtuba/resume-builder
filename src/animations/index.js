export const FadeInOutWithOpacityAlone = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUpDownDropMenu = {
  initial: { opacity: 0, y: 0 },
  animate: { opacity: 1, y: 25 },
  exit: { opacity: 0, y: 0 },
};

export const slideUpDown = {
  initial: { opacity: 0, y: 20, scale: 0.6 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.6 },
};

export const scaleINOut = (index) => {
  return {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.85 },
    transition: { delay: index * 0.3, ease: "easeInOut" },
  };
};

export const opacityINOut = (index) => {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { delay: index * 0.1, ease: "easeInOut" },
  };
};
