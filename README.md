# Goals and Status

This module will simplify the process of integrating CheddarGetter into your existing node.js apps.

As of version 0.0.3 the module implements the fallowing API calls:

* getAllPricingPlans(callback)
* getPricingPlan(planCode, callback)
* getAllCustomers([searchParams], callback)
* getCustomer(customerCode, callback)
* createCustomer(customerData, callback)
* editCustomerAndSubscription(customerData, callback)
* editCustomer(customerCode, customerData, callback)
* editSubscription(customerCode, customerData, callback)
* deleteCustomer(customerCode, callback)
* cancelSubscription(customerCode, callback)
* addItem(customerCode, itemCode, [amount], callback)
* removeItem(customerCode, itemCode, [amount], callback)
* setItemQuantity(customerCode, itemCode, amount, callback)

All callbacks are called with `error` and `results` parameters.

Not all API calls have been fully tested and many unit tests are still missing.

# Install

	npm install cheddargetter

# Usage

	var CheddarGetter = require("CheddarGetter");
	
	var cg = new CheddarGetter("test@test.com", "TestPass", "ProdCode");
	
	cg.getAllPricingPlans(function (err, results) {
		console.log(err, results);
	});

# Tests

	node test
