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
		path: "/xml" + path,
		method: "POST"
	};

	if (data) {
		data = qs.stringify(data);

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
			xml.parseString(data, function (err, xml) {
				var type = Object.keys(xml)[0];

				if (type == "#") {
					callback(new Error(xml["#"]));
				} else {
					callback(null, xml[type]);
				}
			});
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
cheddargetter.prototype.updateCustomerAndSubscription = cheddargetter.prototype.editCustomerAndSubscription;

cheddargetter.prototype.editCustomer = function (code, data, callback) {
	this.callAPI(data, "/customers/edit-customer/productCode/" + this.productCode + "/code/" + code, callback);
};
cheddargetter.prototype.updateCustomer = cheddargetter.prototype.editCustomer;

cheddargetter.prototype.editSubscription = function (code, data, callback) {
	this.callAPI(data, "/customers/edit-subscription/productCode/" + this.productCode + "/code/" + code, callback);
};
cheddargetter.prototype.updateSubscription = cheddargetter.prototype.editSubscription;

cheddargetter.prototype.deleteCustomer = function (customerCode, callback) {
	this.callAPI("/customers/delete/productCode/" + this.productCode + "/code/" + customerCode, callback);
};

cheddargetter.prototype.cancelSubscription = function (customerCode, callback) {
	this.callAPI("/customers/cancel/productCode/" + this.productCode + "/code/" + customerCode, callback);
};

cheddargetter.prototype.addItem = function (customerCode, itemCode, amount, callback) {
	if (!callback && typeof(amount) == "function") {
		callback = amount;
		amount = null;
	}

	if (amount) {
		amount = {quantity: amount.toString()};
	}

	this.callAPI(amount, "/customers/add-item-quantity/productCode/" + this.productCode + "/code/" + customerCode + "/itemCode/" + itemCode, callback);
};

cheddargetter.prototype.removeItem = function (customerCode, itemCode, amount, callback) {
	if (!callback && typeof(amount) == "function") {
		callback = amount;
		amount = null;
	}

	if (amount) {
		amount = {quantity: amount.toString()};
	}

	this.callAPI(amount, "/customers/remove-item-quantity/productCode/" + this.productCode + "/code/" + customerCode + "/itemCode/" + itemCode, callback);
};

cheddargetter.prototype.setItemQuantity = function (customerCode, itemCode, amount, callback) {
	amount = {quantity: amount.toString()};
	this.callAPI(amount, "/customers/set-item-quantity/productCode/" + this.productCode + "/code/" + customerCode + "/itemCode/" + itemCode, callback);
};

cheddargetter.prototype.addCustomCharge = function (customerCode, chargeCode, quantity, amount, description, callback) {
	var data = {
		chargeCode: chargeCode,
		quantity: quantity.toString(),
		eachAmount: amount.toString(),
		description: description
	};

	this.callAPI(data, "/customers/add-charge/productCode/" + this.productCode + "/code/" + customerCode, callback);
};

cheddargetter.prototype.deleteCustomCharge = function (customerCode, chargeId, callback) {
	chargeId = {chargeId: chargeId};
	this.callAPI(amount, "/customers/delete-charge/productCode/" + this.productCode + "/code/" + customerCode, callback);
};

cheddargetter.prototype.oneTimeInvoice = function (customerCode, data, callback) {
	this.callAPI(data, "/invoices/new/productCode/" + this.productCode + "/code/" + customerCode, callback);
};

