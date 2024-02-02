export const convertToString = (param: string | string[] | undefined) => {
    // Check if param is defined
    if (param !== undefined) {
        // Check if param is an array
        if (Array.isArray(param)) {
            // If it's an array, you might want to handle each element separately or convert it to a string
            return param.join(','); // Convert arsray to comma-separated string
        } else {
            // If it's a string, directly pass it to the function
            return param;
        }
    } else {
        return '';
    }
}