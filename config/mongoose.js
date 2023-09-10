const express = require("express");

const mongoose = require("mongoose");
const env = require("./environment");

mongoose.connect(`mongodb://localhost:/${env.db}`);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "error"));

db.once("open", () => {
	console.log("successfully");
});

module.exports = db;
