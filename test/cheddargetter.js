var fs = require("fs");
var async = require("async");
var Cheddargetter = require("../lib/cheddargetter");

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

module.exports.Customers = function (test) {
	var cg = new Cheddargetter(config.user, config.pass, config.productCode);
	async.waterfall([function (cb) {
		cg.getAllPricingPlans(cb);
	}, function (result, cb) {
		test.ok(result.plan instanceof Array, "getAllPricingPlans should return a plan array");
		test.ok(result.plan.length > 0, "There should be more than 0 plans");

		cg.getPricingPlan(result.plan[0]["@"].code, cb);
	}, function (result, cb) {
		test.ok(result.plan instanceof Object, "getPricingPlan should return a plan object");

		cb();
	}], function (err) {
		test.ifError(err);
		test.done();
	});
};
