export function getTextDate(date: string | undefined) {
	const monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]

	if (date) {
		const dateArr = date.split("-")

		return `${monthNames[ parseInt(dateArr[ 1 ]) - 1 ]} ${dateArr[ 0 ]}`
	}

	return "Unknown"
}