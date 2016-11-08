function get(url, parseJSON, cb) {
	const xhr = new XMLHttpRequest();

	xhr.addEventListener("load", function() {
		try {
			if(parseJSON) {
				cb(null, JSON.parse(this.responseText));
			} else {
				cb(null, this.responseText);
			}
		} catch(error) {
			cb(error);
		}
	});

	xhr.open("GET", url);
	xhr.send();
};

const logs = document.getElementById("logs");

get("/logs", true, (err, data) => {
	console.log(err || data);

	console.log(data);
	console.log(data.map);

	logs.innerHTML = data.map(log => `
	<strong>${log.date}</strong> ${log.text}
	`);
});
