const crypto = require("crypto");
const Trench = require("trench");
const Redis = require("p-redis");
const bluebird = require("bluebird");
const moment = require("moment");

const randomBytes = bluebird.promisify(crypto.randomBytes);

const app = new Trench();
const db = Redis.createClient();

app.use(Trench.static(__dirname + "/static"));
app.use(Trench.bodyParser());

const key = "daily:logs";

app.use((req, res) => {
	res.redirect = function(path) {
		this.writeHead(302, { "Location": path });
		this.end();
	};
});

app.get("/logs", (req, res) => {
	const dates = [ +moment().subtract("1", "week"), +moment() ];

	return db.zrangebyscoreAsync(key, ...dates)
	.then(data => {
		res.end(JSON.stringify(data.map(JSON.parse)));
	});
});

app.post("/new", (req, res) => {
	const { text } = req.body;

	return randomBytes(256)
	.then(data => {
		const hash = crypto.createHash("sha256");
		hash.update(data);

		return hash.digest("base64");
	})
	.then(id => {
		const date = +moment();
		const member = JSON.stringify({ id, date, text });
		return db.zadd(key, date, member);
	})
	.then(() => {
		res.redirect("/");
	});
});

app.listen(8080);
