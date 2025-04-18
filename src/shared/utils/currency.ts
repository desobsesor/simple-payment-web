/**
 * Formats a number into a localized currency string representation
 * @param {number} amount - The numeric amount to format
 * @param {string} locale - The locale identifier (e.g., 'en-US', 'es-CO') to determine formatting rules
 * @returns {string} The formatted currency string according to the specified locale
 * @example
 * formatToLocalCurrency(1000, 'es-CO') // Returns "$1,000.00"
 * formatToLocalCurrency(1500.50, 'en-US') // Returns "$1,500.50"
 */

export function formatToLocalCurrency(amount: number, locale: string): string {
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
    });

    return formatter.format(amount);
}