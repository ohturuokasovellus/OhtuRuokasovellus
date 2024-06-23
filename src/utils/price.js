/** Utility for formatting integer price to comma-separated decimal. */
const formatPrice = (price) => {
    let formatted =(price/100).toString().replace(/\./, ',');
    if (formatted.indexOf(',') !== -1) {
        const fractionalPart = formatted.split(',')[1];
        if (fractionalPart.length === 1) {
            formatted += '0';
        }
    } else {
        formatted += ',00';
    }
    return formatted += ' €';
};

export { formatPrice };
