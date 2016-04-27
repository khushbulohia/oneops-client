module.exports = {
	options : function getOptions(environment) {
		var options = {
			uri : environment.endpoint + environment.org,
			method : 'GET',
			headers : {
				'Authorization' : 'Basic ' + new Buffer(environment.authkey).toString('base64'),
				'content-type' : 'application/json',
				'accept' : 'application/json'
			}
		}
		return options;
	}
}
