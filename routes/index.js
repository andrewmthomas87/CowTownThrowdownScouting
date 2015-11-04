var express = require('express')

var connection = require('../connection')

var router = express.Router()

var done = [
	false,
	false
]

router.get('/', function(request, response) {
	response.render('index', {
		title: 'Cow Town Scouting'
	})
})

router.get('/teams', function(request, response) {
	var alliance = request.query.alliance == 0 ? 'red' : 'blue'

	if (!alliance) {
		return request.sendStatus(403)
	}

	var sql = 'select matchNumber, ' + alliance + '1, ' + alliance + '2, ' + alliance + '3 from matches where played=0 limit 1'

	connection.query(sql, function(error, rows) {
		if (error) {
			throw error
		}

		if (!rows.length) {
			return response.send({
				'status': false
			})
		}

		response.send({
			'status': true,
			'matchNumber': rows[0].matchNumber,
			'teams': [
				rows[0][alliance + '1'],
				rows[0][alliance + '2'],
				rows[0][alliance + '3']
			]
		})
	})
})

router.get('/auto', function(request, response) {
	var teamNumber = request.query.teamNumber
	var matchNumber = request.query.matchNumber
	var type = request.query.type

	console.log(teamNumber)

	if (!(teamNumber && matchNumber && type)) {
		return response.sendStatus(403)
	}

	connection.query('insert into auto (teamNumber, matchNumber, type) values (?, ?, ?)', [
		teamNumber,
		matchNumber,
		type
	], function(error, rows) {
		if (error) {
			throw error
		}

		response.send({
			'status': 'OK'
		})
	})
})

router.get('/stack', function(request, response) {
	var teamNumber = request.query.teamNumber
	var matchNumber = request.query.matchNumber
	var height = request.query.height
	var bin = request.query.bin
	var litter = request.query.litter

	if (!(teamNumber && matchNumber && height && bin && litter)) {
		return response.sendStatus(403)
	}

	connection.query('insert into stack (teamNumber, matchNumber, height, bin, litter) values (?, ?, ?, ?, ?)', [
		teamNumber,
		matchNumber,
		height,
		bin,
		litter
	], function(error, rows) {
		if (error) {
			throw error
		}

		response.send({
			'status': 'OK'
		})
	})
})

router.get('/cap', function(request, response) {
	var teamNumber = request.query.teamNumber
	var matchNumber = request.query.matchNumber
	var height = request.query.height

	if (!(teamNumber && matchNumber && height)) {
		return response.sendStatus(403)
	}

	connection.query('insert into cap (teamNumber, matchNumber, height) values (?, ?, ?)', [
		teamNumber,
		matchNumber,
		height
	], function(error, rows) {
		if (error) {
			throw error
		}

		response.send({
			'status': 'OK'
		})
	})
})

router.get('/error', function(request, response) {
	var teamNumber = request.query.teamNumber
	var matchNumber = request.query.matchNumber
	var type = request.query.type

	console.log(teamNumber)

	if (!(teamNumber && matchNumber && type)) {
		return response.sendStatus(403)
	}

	connection.query('insert into error (teamNumber, matchNumber, type) values (?, ?, ?)', [
		teamNumber,
		matchNumber,
		type
	], function(error, rows) {
		if (error) {
			throw error
		}

		response.send({
			'status': 'OK'
		})
	})
})

router.get('/end', function(request, response) {
	var alliance = request.query.alliance
	var matchNumber = request.query.matchNumber

	if (!(alliance && matchNumber)) {
		return response.sendStatus(403)
	}

	done[alliance] = true

	if (done[0] && done[1]) {
		connection.query('update matches set played=1 where matchNumber=?', matchNumber, function(error, rows) {
			if (error) {
				throw error
			}

			response.redirect('/')
		})
	}
	else {
		response.render('waiting', {
			'title': 'Waiting'
		})
	}
})

router.get('/done', function(request, response) {
	var status = done[0] && done[1]

	if (status) {
		done = [
			false,
			false
		]
	}

	response.send({
		'status': status
	})
})

module.exports = router
