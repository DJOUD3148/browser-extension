/**
 * Check if a date is today.
 * @param {Date} dateToCheck - Date object to compare
 * @returns {boolean} True if the date is today
 */
const isToday = (dateToCheck) => {
	const today = new Date();

	return (
		dateToCheck.getDate() === today.getDate() &&
		dateToCheck.getMonth() === today.getMonth() &&
		dateToCheck.getFullYear() === today.getFullYear()
	);
};

/**
 * Format a Unix timestamp into a localized Russian date string.
 * Omits the current year. If the date is today, includes time.
 * @param {number} date - Unix timestamp in seconds
 * @param {Intl.DateTimeFormatOptions} [params] - Intl formatting options
 * @returns {string} Localized date string (e.g. "15 марта" or "15 марта, 14:30")
 */
const localizeDate = (
	date,
	params = {
		month: "long",
		day: "numeric",
		year: "numeric",
	},
) => {
	const dateObj = new Date(date * 1000);
	const currentYear = new Date().getFullYear();
	const yearPattern = new RegExp(`\\s*${currentYear}\\s*г\\.?,?\\s*`, "g");

	if (isToday(dateObj)) {
		const dateWithTime = dateObj.toLocaleString("ru", {
			...params,
			hour: "2-digit",
			minute: "2-digit",
		});

		return dateWithTime.replace(yearPattern, " ").replace(" в ", ", ").trim();
	}

	const convertedDate = dateObj.toLocaleString("ru", params);

	return convertedDate.replace(yearPattern, "").trim();
};

export default localizeDate;
