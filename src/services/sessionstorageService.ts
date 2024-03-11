export const setItemToSessionStorage = (key: string, value: string) => {
    sessionStorage.setItem(key, value);
}

export const getItemFromSessionStorage = (key: string) => {
    return sessionStorage.getItem(key);
}

export const removeItemFromSessionStorage = (key: string) => {
    sessionStorage.removeItem(key);
}