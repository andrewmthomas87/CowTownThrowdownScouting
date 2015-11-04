
function get(path, data, callback) {
	var dataURI = '?'
	Object.keys(data).forEach(function(key) {
		dataURI += encodeURI(key) + '=' + encodeURI(data[key]) + '&'
	})
	dataURI = dataURI.substr(0, dataURI.length - 1)

	var request = new XMLHttpRequest()
	request.onreadystatechange = function() {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				callback(false, JSON.parse(request.responseText))
			}
			else {
				callback(true)
			}
		}
	}
	request.open('GET', 'http://' + ip + '/' + path + dataURI)
	request.send()
}

var waiting = (function() {

	var initialize = function() {
		setInterval(check, 1000)
	}

	var check = function() {
		get('done', {}, function(error, response) {
			if (error) {
				return
			}

			if (response.status) {
				window.location = '/'
			}
		})
	}

	return {
		'initialize': initialize
	}

})()

window.addEventListener('load', waiting.initialize)
