(() => {
	const getJSON = url => fetch(url)
		.then(response => response.json());

	getJSON("/api/log").then(log => {
		const entries = Object.entries(log);

		$(".log").html(entries.map(e => {
			return `<span><b>${new Date(+e[0])}</b> ${e[1]}</span>`
		}).join(""))
	});
})();
