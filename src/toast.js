let addToastGlobal = null;

export const toast = {
  success: (msg) => addToastGlobal?.(msg, 'success'),
  error: (msg) => addToastGlobal?.(msg, 'error'),
  info: (msg) => addToastGlobal?.(msg, 'info'),
};

export const registerToastDispatcher = (fn) => {
  addToastGlobal = fn;
};
