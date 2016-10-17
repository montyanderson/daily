const Trench = require("../trench");
const Redis = require("ioredis");

const app = new Trench();
const redis = new Redis();

const log = "log";

app.use(Trench.static(__dirname + "/static"));

app.get("/api/log", (req, res) => {
	return redis.zrevrangebyscore(log, "+inf", "-inf", "WITHSCORES", "LIMIT", 0, 10)
		.then(response => {
			const obj = {};

			for(let i = 0; i < response.length; i += 2) {
				obj[response[i + 1]] = response[i];
			}

			res.end(JSON.stringify(obj));
		});
}, (req, res) => {
	res.end();
});

app.listen(8080);
