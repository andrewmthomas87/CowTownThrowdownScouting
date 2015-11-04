var alliance, matchNumber

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

var allianceSelection = (function() {

	var section, red, blue

	var initialize = function() {
		section = document.querySelector('section#allianceSelection')
		var buttons = section.querySelectorAll('a')
		red = buttons[0]
		blue = buttons[1]

		red.addEventListener('click', function() {
			selectAlliance(0)
		})

		blue.addEventListener('click', function() {
			selectAlliance(1)
		})

		setTimeout(fadeIn, 1000)
	}

	var fadeIn = function() {
		section.classList.remove('hidden')
	}

	var fadeOut = function() {
		section.classList.add('hidden')
		setTimeout(scouting.initialize, 250)
	}

	var selectAlliance = function(type) {
		alliance = type
		fadeOut()
	}

	return {
		'initialize': initialize
	}

})()

var scouting = (function() {

	var team

	var section, teamElements, matchNumberDisplay, stackHeight, stackToggles, success

	var initialize = function() {
		section = document.querySelector('section#scouting')

		success = section.querySelector('span#success')

		teamElements = section.querySelectorAll('div#teams a')
		matchNumberDisplay = section.querySelector('div#teams span')

		var autoElements = section.querySelectorAll('div#auto a')

		stackHeight = section.querySelector('div#stack select')
		stackToggles = section.querySelectorAll('div#stack a.toggle')
		var stackScored = section.querySelector('div#stack a:last-child')

		var capElements = section.querySelectorAll('div#cap a')

		var errorElements = section.querySelectorAll('div#error a')

		var end = section.querySelector('a#end')

		section.classList.add(alliance ? 'blue' : 'red')

		for (var i = 0, length = teamElements.length; i < length; i++) {
			teamElements[i].addEventListener('click', switchTeams)
		}

		for (var i = 0, length = autoElements.length; i < length; i++) {
			autoElements[i].addEventListener('click', auto)
		}

		stackToggles[0].addEventListener('click', binToggle)
		stackToggles[1].addEventListener('click', litterToggle)

		stackScored.addEventListener('click', stack)

		for (var i = 0, length = capElements.length; i < length; i++) {
			capElements[i].addEventListener('click', cap)
		}

		for (var i = 0, length = errorElements.length; i < length; i++) {
			errorElements[i].addEventListener('click', error)
		}

		end.addEventListener('click', function() {
			window.location = '/end?alliance=' + alliance + '&matchNumber=' + matchNumber
		})

		reset()
	}

	var reset = function() {
		get('teams', {
			'alliance': alliance
		}, handleTeams)
	}

	var fadeIn = function() {
		section.classList.remove('hidden')
	}

	var handleTeams = function(error, response) {
		if (!error) {
			if (!response.status) {
				return document.querySelector('section#done').classList.remove('hidden')
			}

			matchNumber = response.matchNumber
			matchNumberDisplay.innerHTML = 'Match ' + matchNumber

			team = response.teams[0]

			for (var i = 0; i < 3; i++) {
				teamElements[i].innerHTML = response.teams[i]
				fadeIn()
			}
		}
		else {
			location.reload()
		}
	}

	var switchTeams = function() {
		section.querySelector('div#teams a.selected').classList.remove('selected')
		this.classList.add('selected')

		team = parseInt(this.innerHTML)
	}

	var auto = function() {
		get('auto', {
			'teamNumber': team,
			'matchNumber': matchNumber,
			'type': parseInt(this.getAttribute('type'))
		}, handleResponse)
	}

	var binToggle = function() {
		this.classList.toggle('active')
	}

	var litterToggle = function() {
		if (!this.classList.contains('active')) {
			this.parentNode.querySelector('a.toggle').classList.add('active')
		}
		this.classList.toggle('active')
	}

	var stack = function() {
		get('stack', {
			'teamNumber': team,
			'matchNumber': matchNumber,
			'height': parseInt(stackHeight.value),
			'bin': stackToggles[0].classList.contains('active') ? 1 : 0,
			'litter': stackToggles[1].classList.contains('active') ? 1 : 0
		}, handleResponse)
		for (var i = 0, length = stackToggles.length; i < length; i++) {
			stackToggles[i].classList.remove('active')
			stackHeight.value = '1'
		}
	}

	var cap = function() {
		get('cap', {
			'teamNumber': team,
			'matchNumber': matchNumber,
			'height': parseInt(this.innerHTML)
		}, handleResponse)
	}

	var error = function() {
		get('error', {
			'teamNumber': team,
			'matchNumber': matchNumber,
			'type': parseInt(this.getAttribute('type'))
		}, handleResponse)
	}

	var handleResponse = function(error) {
		if (error) {
			return location.reload()
		}

		showSuccess()
	}

	var showSuccess = function() {
		success.classList.remove('hidden')
		setTimeout(hideSuccess, 1000)
	}

	var hideSuccess = function() {
		success.classList.add('hidden')
	}

	return {
		'initialize': initialize
	}

})()

window.addEventListener('load', allianceSelection.initialize)
