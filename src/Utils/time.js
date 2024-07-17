exports.showTimeInAgoFormat = (time) => {
	switch (typeof time) {
		case "number":
			break;
		case "string":
			time = +new Date(time);
			break;
		case "object":
			if (time.constructor === Date) time = time.getTime();
			break;
		default:
			time = +new Date();
	}
	var time_formats = [
		[60, "seconds", 1], // 60
		[120, "1 minute ago", "1 minute from now"], // 60*2
		[3600, "minutes", 60], // 60*60, 60
		[7200, "1 hour ago", "1 hour from now"], // 60*60*2
		[86400, "hours", 3600], // 60*60*24, 60*60
		[172800, "Yesterday", "Tomorrow"], // 60*60*24*2
		[604800, "days", 86400], // 60*60*24*7, 60*60*24
		[1209600, "Last week", "Next week"], // 60*60*24*7*4*2
		[2419200, "weeks", 604800], // 60*60*24*7*4, 60*60*24*7
		[4838400, "Last month", "Next month"], // 60*60*24*7*4*2
		[29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
		[58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
		[2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
		[5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
		[58060800000, "centuries", 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
	];
	var seconds = (+new Date() - time) / 1000,
		token = "ago",
		list_choice = 1;

	if (seconds === 0) {
		return "Just now";
	}
	if (seconds < 0) {
		seconds = Math.abs(seconds);
		token = "from now";
		list_choice = 2;
	}
	var i = 0,
		format;
	while ((format = time_formats[i++]))
		if (seconds < format[0]) {
			if (typeof format[2] == "string") return format[list_choice];
			else
				return Math.floor(seconds / format[2]) + " " + format[1] + " " + token;
		}
	return time;
};
exports.showInDeadlineFormat = (time) => {
	switch (typeof time) {
		case "number":
			break;
		case "string":
			time = +new Date(time);
			break;
		case "object":
			if (time.constructor === Date) time = time.getTime();
			break;
		default:
			time = +new Date();
	}

	var time_formats = [
		[60, "second", 1],
		[120, "1 minute", "1 minute"],
		[3600, "minute", 60],
		[7200, "1 hour", "1 hour"],
		[86400, "hour", 3600],
		[172800, "Yesterday", "Tomorrow"],
		[604800, "day", 86400],
		[1209600, "Last week", "Next week"],
		[2419200, "week", 604800],
		[4838400, "Last month", "Next month"],
		[29030400, "month", 2419200],
		[58060800, "Last year", "Next year"],
		[2903040000, "year", 29030400],
		[5806080000, "Last century", "Next century"],
		[58060800000, "century", 2903040000],
	];

	var seconds = (time - +new Date()) / 1000;

	if (seconds === 0) {
		return "Just now";
	}

	var token = seconds > 0 ? "left" : "overdue";
	seconds = Math.abs(seconds);

	var i = 0,
		format;

	while ((format = time_formats[i++])) {
		if (seconds < format[0]) {
			var count = Math.floor(seconds / format[2]);
			return `${count} ${format[1]}${count !== 1 ? "s" : ""} ${token}`;
		}
	}

	return time;
};

exports.convertMillisecondsToDate = (ms) => {
	const options = { year: "numeric", month: "long", day: "numeric" };
	return new Date(ms).toLocaleDateString(undefined, options);
};

exports.parseDateToMillisecondsToTime = (dateString) => {
	try {
		const parsedDate = new Date(dateString);
		const milliseconds = parsedDate.getTime();
		const time = this.convertMillisecondsToDate(milliseconds);
		return time;
	} catch {
		return "";
	}
};

exports.parseDateToMillisecondsToAgoFormat = (dateString) => {
	try {
		const parsedDate = new Date(dateString);
		const milliseconds = parsedDate.getTime();
		const time = this.showTimeInAgoFormat(milliseconds);
		return time;
	} catch {
		return "";
	}
};

exports.formatDateToYYYYMMDD = (timestamp) => {
	const date = new Date(timestamp);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
};

exports.formatMillisecondsDate = (milliseconds) => {
	const date = new Date(milliseconds);

	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const pad = (num) => (num < 10 ? "0" + num : num);

	// Define an array of month names
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"June",
		"July",
		"Aug",
		"Sept",
		"Oct",
		"Nov",
		"Dec",
	];

	// Format the date as "day-monthname hh:mm"
	const formattedDate = `${pad(day)}-${monthNames[month - 1]} ${pad(
		hours
	)}:${pad(minutes)}`;

	return formattedDate;
};

exports.formatTimeAMPM = (timestamp) => {
	// Convert the timestamp to a Date object
	const date = new Date(timestamp);

	// Get hours, minutes, and AM/PM indicator
	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? "PM" : "AM";

	// Convert hours to 12-hour format
	hours = hours % 12;
	hours = hours === 0 ? 12 : hours;

	// Add leading zero to minutes if needed
	const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

	// Construct the formatted time string
	const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;

	return formattedTime;
};

// utils/time.js
exports.formatMilliseconds = (ms) => {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);

	const hoursStr = hours > 0 ? `${hours}h ` : "";
	const minutesStr = `${minutes}m`;

	return hoursStr + minutesStr;
};
// utils/time.js
exports.formatMillisecondsMs = (ms) => {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	const hoursStr = `${hours}h`;
	const minutesStr = `${minutes}m`;
	const secondsStr = `${seconds}s`;

	return `${hoursStr}:${minutesStr}:${secondsStr}`;
};

exports.formatTimeInStartsInFormat = (milliseconds) => {
	// Calculate the difference between current UTC time and the provided time
	const now = new Date().getTime();
	const difference = milliseconds - now;

	if (difference <= 0) {
		return "Event is starting soon"; // Event has already started or is about to start
	}

	// Calculate hours, minutes and second
	const hours = Math.floor(difference / (1000 * 60 * 60));
	const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
	// const seconds = Math.floor()
	// Format the result
	const hoursString = hours > 0 ? `${hours} ${hours === 1 ? "h" : "h"}` : "";
	const minutesString =
		minutes > 0 ? `${minutes} ${minutes === 1 ? "m" : "m"}` : "";

	// Construct the final string
	const result =
		hours > 0 && minutes > 0
			? `${hoursString} ${minutesString}`
			: hours > 0
			? `${hoursString}`
			: minutes > 0
			? `${minutesString}`
			: "Event is starting soon";

	return result;
};

exports.determineDay = (ms) => {
	const options = {
		timeZone: "Asia/Kolkata",
		hour12: true,
		hour: "numeric",
		minute: "numeric",
	};

	const now = new Date();
	const targetDate = new Date(ms);

	// Convert dates to IST
	const nowIST = new Date(
		now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
	);
	const targetDateIST = new Date(
		targetDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
	);

	const isToday =
		nowIST.getDate() === targetDateIST.getDate() &&
		nowIST.getMonth() === targetDateIST.getMonth() &&
		nowIST.getFullYear() === targetDateIST.getFullYear();

	const isTomorrow =
		nowIST.getDate() + 1 === targetDateIST.getDate() &&
		nowIST.getMonth() === targetDateIST.getMonth() &&
		nowIST.getFullYear() === targetDateIST.getFullYear();

	if (isToday) {
		const timeString = targetDateIST.toLocaleString("en-US", options);
		return `Today, ${timeString}`;
	}

	if (isTomorrow) {
		const timeString = targetDateIST.toLocaleString("en-US", options);
		return `${timeString}`;
	}

	const timeString = targetDateIST.toLocaleString("en-US", options);
	return `${timeString}`;
};

exports.formatTimeAM = (milliseconds) => {
	const now = new Date();
	const targetDate = new Date(milliseconds);
	let hours = targetDate.getHours();
	const minutes = targetDate.getMinutes();
	const ampm = hours >= 12 ? "PM" : "AM";

	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
	let show;
	show = `${hours}:${minutesStr} ${ampm}`;

	const isToday =
		now.getDate() === targetDate.getDate() &&
		now.getMonth() === targetDate.getMonth() &&
		now.getFullYear() === targetDate.getFullYear();

	if (isToday) show = `today ${hours}:${minutesStr} ${ampm}`;

	return show;
};

exports.formatCountdown = (ms) => {
	const options = {
		timeZone: "Asia/Kolkata",
		hour12: true,
		hour: "numeric",
		minute: "numeric",
	};

	const now = new Date();
	const targetDate = new Date(ms - 60 * 60 * 1000);

	// Convert dates to IST
	const nowIST = new Date(
		now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
	);
	const targetDateIST = new Date(
		targetDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
	);

	const difference = targetDateIST.getTime() - nowIST.getTime();
	// Less than 24 hours remaining
	if (difference < 24 * 60 * 60 * 1000) {
		const hours = Math.floor(difference / (1000 * 60 * 60));
		const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
		// 24 hours in milliseconds
		return `${hours}h ${minutes}m`;
	}

	// Between 24 and 48 hours remaining
	if (difference < 48 * 60 * 60 * 1000) {
		const hours = Math.floor(difference / (1000 * 60 * 60));
		const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

		// 48 hours in milliseconds
		return `Tomorrow`;
	}

	// More than 48 hours remaining
	const day = targetDateIST.getDate();
	const month = targetDateIST.toLocaleString("default", { month: "short" });

	// Format day with ordinal suffix
	const dayWithSuffix =
		day +
		(day % 10 === 1 && day !== 11
			? "st"
			: day % 10 === 2 && day !== 12
			? "nd"
			: day % 10 === 3 && day !== 13
			? "rd"
			: "th");

	return `${dayWithSuffix} ${month}`;
};

exports.customSleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
