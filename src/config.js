const path = require("path");
const pr = path.resolve;

const base = pr(__dirname, ".");

module.exports = {
	root: base,
	node_modules: pr(base, "node_modules"),
	vendor: [
            pr(base, "index.js"),
            pr(base, "node_modules", "react"),
            pr(base, "node_modules", "react-dom"),
            pr(base, "node_modules", "react-router"),
            pr(base, "node_modules", "core-decorators")
	]
}