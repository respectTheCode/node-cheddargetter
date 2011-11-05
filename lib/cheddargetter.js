var https = require("https");
var qs = require("qs");
var xml2js = require("xml2js");

var cheddargetter = module.exports = function (user, pass, productCode) {
	this.auth = "Basic " + new Buffer(user + ":" + pass).toString("base64");
	this.pass = pass;
	this.productCode = productCode;
};

cheddargetter.prototype.callAPI = function (data, path, callback) {
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

cheddargetter.prototype.getAllPricingPlans = function (callback) {
	this.callAPI("/plans/get/productCode/" + this.productCode, callback);
};

cheddargetter.prototype.getPricingPlan = function (code, callback) {
	this.callAPI("/plans/get/productCode/" + this.productCode + "/code/" + code, callback);
};

cheddargetter.prototype.getAllCustomers = function (data, callback) {
	if (!callback && typeof(data) == "function") {
		callback = data;
		data = null;
	}
	this.callAPI(data, "/customers/get/productCode/" + this.productCode, callback);
};

cheddargetter.prototype.getCustomer = function (code, callback) {
	this.callAPI("/customers/get/productCode/" + this.productCode + "/code/" + code, callback);
};

cheddargetter.prototype.createCustomer = function (data, callback) {
	this.callAPI(data, "/customers/new/productCode/" + this.productCode, callback);
};

cheddargetter.prototype.editCustomerAndSubscription = function (code, data, callback) {
	this.callAPI(data, "/customers/edit/productCode/" + this.productCode + "/code/" + code, callback);
};

cheddargetter.prototype.editCustomer = function (code, data, callback) {
	this.callAPI(data, "/customers/edit-customer/productCode/" + this.productCode + "/code/" + code, callback);
};

cheddargetter.prototype.editSubscription = function (code, data, callback) {
	this.callAPI(data, "/customers/edit-subscription/productCode" + this.productCode + "/code/" + code, callback);
};

cheddargetter.prototype.deleteCustomer = function (customerCode, callback) {
	this.callAPI("/customers/delete/productCode/" + this.productCode + "/code/" + customerCode, callback);
};
