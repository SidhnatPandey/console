export const setItemToLocalstorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
}

export const getItemFromLocalstorage = (key: string) => {
    return localStorage.getItem(key);
}

export const removeItemFromLocalstorage = (key: string) => {
    localStorage.removeItem(key);
}