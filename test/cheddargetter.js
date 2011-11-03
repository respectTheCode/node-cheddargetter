var fs = require("fs");
var async = require("async");
var CheddarGetter = require("../lib/cheddargetter");

var config = {};

try {
	var json = fs.readFileSync("./config.conf").toString();
	json = JSON.parse(json);

	for (var key in json) {
		if (json.hasOwnProperty(key)) {
			config[key] = json[key];
		}
	}
} catch (error) {
	console.log("Error: " + error);
	process.exit();
}

module.exports = {};

module.exports.Plans = function (test) {
	var cg = new CheddarGetter(config.user, config.pass, config.productCode);
	async.waterfall([function (cb) {
		cg.getAllPricingPlans(cb);
	}, function (result, cb) {
		test.equal(typeof(result.plan),"object", "getAllPricingPlans should return a plan array");
		test.ok(result.plan.length > 0, "There should be more than 0 plans");

		cg.getPricingPlan(result.plan[0]["@"].code, cb);
	}, function (result, cb) {
		test.equal(typeof(result.plan), "object", "getPricingPlan should return a plan object");

		cb();
	}], function (err) {
		test.ifError(err);
		test.done();
	});
};

module.exports.Customers = function (test) {
	var cg = new CheddarGetter(config.user, config.pass, config.productCode);
	async.waterfall([function (cb) {
		cg.createCustomer({
			code: "test",
			firstName: "FName",
			lastName: "LName",
			email: "test@test.com",
			subscription: {
				planCode: config.planCode,
				method: "paypal",
				returnUrl:"http://google.com",
				cancelUrl: "http://google.com"
			}
		}, cb);
	}, function (result, cb) {
		cg.getAllCustomers(cb);
	}, function (result, cb) {
		test.equal(typeof(result.customer), "object", "getAllCustomers should return a customer array");

		cg.getCustomer(result.customer["@"].code || result.customer[0]["@"].code, cb);
	}, function (result, cb) {
		test.equal(typeof(result.customer), "object", "getCustomer should return a customer object");

		cg.deleteCustomer("test", cb);
	}], function (err) {
		test.ifError(err);
		test.done();
	});
};
