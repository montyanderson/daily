(() => {
	const getJSON = url => fetch(url)
		.then(response => response.json());

	getJSON("/api/log")
		.then(a => console.log(a));
})();
