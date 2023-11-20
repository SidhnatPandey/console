export const convertDateFormat = (date: string) => {
    const nDate = new Date(date);
    return nDate.getFullYear() > 2022 ? nDate.toLocaleString() : 'N/A';
}