var https = require("https");
var qs = require("qs");
var xml2js = require("xml2js");

var payment = module.exports = function (user, pass, productCode) {
	this.auth = "Basic " + new Buffer(user + ":" + pass).toString("base64");
	this.pass = pass;
	this.productCode = productCode;
};

payment.prototype.callAPI = function (data, path, callback) {
	if (typeof(path) == "function") {
		callback = path;
		path = data;
		data = null;
	}

	var config = {
		host: "cheddargetter.com",
		port: 443,
		headers: {authorization: this.auth},
		path: "/xml" + path
	};

	if (data) {
		data = qs.stringify(data);
		console.log(data);
		config.method = "POST";
		config.headers["Content-Type"] = "application/x-www-form-urlencoded";
		config.headers["Content-Length"] = data.length;
	}

	var req = https.request(config, function (res) {
		var data = "";

		res.on("data", function (chunk) {
			data += chunk;
		});

		res.on("end", function () {
			var xml = new xml2js.Parser();
			xml.parseString(data, callback);
		});
	});

	req.on("error", function (err) {
		console.log("Payment API Error");
		callback(err, null);
	});

	if (data) {
		req.write(data);
	}

	req.end();
};

payment.prototype.getAllPricingPlans = function (callback) {
	this.callAPI("/plans/get/productCode/" + this.productCode, callback);
};

payment.prototype.getAllCustomers = function (callback) {
	this.callAPI("/customers/get/productCode/" + this.productCode, callback);
};

payment.prototype.createCustomer = function (data, callback) {
	this.callAPI(data, "/customers/new/productCode/" + this.productCode, callback);
};

payment.prototype.deleteCustomer = function (customerCode, callback) {
	this.callAPI("/customers/delete/productCode/" + this.productCode + "/code/" + customerCode, callback);
};
