export function getTextDate(date: string | undefined, options: { day?: boolean, month?: boolean, year?: boolean } = { month: true, year: true }) {
	const monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]

	if (date) {
		const dateArr = date.split("-")

		const day = options.day ? dateArr[ 2 ].replace(/[0^]*/, "") : ""
		const month = (options.month === undefined ? true : options.month) ? " " + monthNames[ parseInt(dateArr[ 1 ]) - 1 ] : ""
		const year = (options.year === undefined ? true : options.year) ? " " + dateArr[ 0 ] : ""

		return `${day}${month}${year}`
	}

	return "Unknown"
}

export function bigNumberShortener(number: number) {

	if (number > (10 ** 6)) {
		const shortNumber = (number / (10 ** 6)).toFixed(1)
		return shortNumber + "m"
	}

	if (number > (10 ** 3)) {
		const shortNumber = (number / (10 ** 3)).toFixed(1)
		return shortNumber + "k"
	}

	return number
}