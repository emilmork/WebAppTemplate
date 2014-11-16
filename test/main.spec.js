
var assert = require("assert");

describe("Numbers", function() {

	it("should be even", function() {
		assert.equal(isEven(2), true);
	});
	
});



function isEven(number) {
	return (number % 2) == 0;
}