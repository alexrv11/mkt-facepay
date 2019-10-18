
export const saveToLocalStorage = (itemName, itemValue) => {
  localStorage.setItem(itemName, JSON.stringify(itemValue));
};

export const getFromLocalStorage = (itemName) => {

  const item = localStorage.getItem(itemName);
  try {
    return item ? JSON.parse(item) : undefined;
  } catch (e) {
    return undefined;
  }
};

export const clearLocalStorage = (itemName) => {
  localStorage.setItem(itemName, null);
};