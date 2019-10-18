
export const saveToLocalStorage = (itemName, itemValue) => {
  localStorage.setItem(itemName, itemValue)
};

export const getFromLocalStorage = (itemName) => {
  localStorage.getItem(itemName);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};