export const debounce = (fn: () => void, delay: number = 300) => {
  let timer: NodeJS.Timeout;

  return (...args: []) => {
    clearTimeout(timer);

    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};
