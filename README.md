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
