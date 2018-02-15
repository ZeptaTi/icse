const fs = require('fs');

module.exports = {
    id
}

function id() {
	let result = "";

	let data = fs.readFileSync('/proc/cpuinfo', "utf8");
	let lines = data.split('\n');

	lines.forEach(line => {

		let lineIsRelevant =
			line.startsWith("Hardware")
			|| line.startsWith("Revision")
			|| line.startsWith("Serial");

		if (lineIsRelevant) {
			let values = line.split(':');
			if (result != "")
				result += "-";
			result += values[1].trim().replace('\t', '');
		}

	});

	return result;
};
