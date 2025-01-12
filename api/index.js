const server = require("../server");
const vercel = require("@vercel/node");

module.exports = vercel(server);
