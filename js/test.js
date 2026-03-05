'use strict';
const createPolicy = trustedTypes.createPolicy;

trustedTypes.createPolicy = function(name, config) {
	try {
		return createPolicy.call(this, name, config);
	} catch(err) {
		console.info(`Error creating ${name}`);
		console.error(err);
	}
}
