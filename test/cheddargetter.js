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
    test.equal(typeof(result),"object", "getAllPricingPlans should return a plan array");
    test.ok(result.length > 0, "There should be more than 0 plans");

    cg.getPricingPlan(result[0]["@"].code, cb);
  }, function (result, cb) {
    test.equal(typeof(result), "object", "getPricingPlan should return a plan object");

    cb();
  }], function (err) {
    test.ifError(err);
    test.done();
  });
};

module.exports.PlanError = function (test) {
  var cg = new CheddarGetter(config.user, config.pass, config.productCode);

  cg.getPricingPlan("Bad Plan Code", function (err, customer) {
    test.notEqual(err, null);
    test.equal(customer, null);
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
        method: "cc",
        ccNumber: "4111111111111111",
        ccExpiration: "12/2012",
        ccCardCode: "123",
        ccFirstName: "FName",
        ccLastName:"LName",
        ccZip: "95123"
      }
    }, cb);
  }, function (result, cb) {
    cg.createCustomer({
      code: "test1",
      firstName: "FName2",
      lastName: "LName2",
      email: "test2@test.com",
      subscription: {
        planCode: config.planCode,
        method: "cc",
        ccNumber: "4111111111111111",
        ccExpiration: "12/2012",
        ccCardCode: "123",
        ccFirstName: "FName2",
        ccLastName:"LName2",
        ccZip: "95123"
      }
    }, cb);
  }, function (result, cb) {
    cg.getAllCustomers(cb);
  }, function (result, cb) {
    test.equal(typeof(result), "object", "getAllCustomers should return a customer array");
    test.equal(result.length, 2, "getAllCustomers should return 2 customers");
    test.equal(result[0]["@"].code, "test", "first customer should be 'test'");

    cg.getCustomer("test", cb);
  }, function (result, cb) {
    test.equal(typeof(result), "object", "getCustomer should return a customer object");
    cb();
  }], function (err) {
    test.ifError(err);
    test.done();
  });
};

module.exports.CustomerError = function (test) {
  var cg = new CheddarGetter(config.user, config.pass, config.productCode);

  cg.getCustomer("Bad Customer Code", function (err, customer) {
    test.notEqual(err, null);
    test.equal(customer, null);
    test.done();
  });
};

module.exports.Items = function (test) {
  var cg = new CheddarGetter(config.user, config.pass, config.productCode);

  async.waterfall([function (cb) {
    cg.setItemQuantity("test", config.itemCode, 5, cb);
  }, function (result, cb) {
    cg.getCustomer("test", cb);
  }, function (result, cb) {
    test.equal(parseInt(result.subscriptions.subscription.items.item[0].quantity, 10), 5);
    cb(null, {});
  }, function (result, cb) {
    cg.addItem("test", config.itemCode, 2, cb);
  }, function (result, cb) {
    cg.getCustomer("test", cb);
  }, function (result, cb) {
    test.equal(parseInt(result.subscriptions.subscription.items.item[0].quantity, 10), 5 + 2);
    cb(null, {});
  }, function (result, cb) {
    cg.addItem("test", config.itemCode, cb);
  }, function (result, cb) {
    cg.getCustomer("test", cb);
  }, function (result, cb) {
    test.equal(parseInt(result.subscriptions.subscription.items.item[0].quantity, 10), 5 + 2 + 1);
    cb(null, {});
  }, function (result, cb) {
    cg.removeItem("test", config.itemCode, 2, cb);
  }, function (result, cb) {
    cg.getCustomer("test", cb);
  }, function (result, cb) {
    test.equal(parseInt(result.subscriptions.subscription.items.item[0].quantity, 10), 5 + 2 + 1 - 2);
    cb(null, {});
  }, function (result, cb) {
    cg.removeItem("test", config.itemCode, cb);
  }, function (result, cb) {
    cg.getCustomer("test", cb);
  }, function (result, cb) {
    test.equal(parseInt(result.subscriptions.subscription.items.item[0].quantity, 10), 5 + 2 + 1 - 2 - 1);
    cb(null, {});
  }, function (result, cb) {
    cg.deleteCustomer("test", cb);
  }, function (result, cb) {
    cg.deleteCustomer("test1", cb);
  }], function (err) {
    test.ifError(err);
    test.done();
  });
};
