var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Tino0211',
	database: 'Pheonix'
});
var moment = require('moment');

module.exports = {

	index: function(req, res) {
		var guest;
		var data = req.session;

		if (data && data.guest) {
			guest = guest;
		} else {
			guest = true;
		}

		res.render('conference/createconference.ejs', {title: 'Pheonix', guest: guest, auth: true});
	},

	create: function(req, res) {
		var data = req.body;
		var sess = req.session;

		if (sess.guest == false) {
			connection.connect(function(err) {
				if (err) {
					console.log(err);
					res.redirect('/');
				}
			});

			var dates = JSON.stringify([data.from, data.to]);

			var query = "INSERT INTO `Conferences`(`UserId`, `Title`, `Email`, `Dates`, `PaymentInfo`) VALUES ('" + sess.userid + "', '" + data.title + "', '" + data.email + "', '" + dates + "', '')";
			connection.query(query, function(err, results) {
				if (err) {
					console.log(err);
					connection.destroy();
					res.redirect('/');
				}

				connection.destroy();
				res.redirect('/@me');
			});
		} else {
			res.redirect('/');
		}
	},

	home: function(req, res) {
		var conferenceId = req.params.conferenceId;
		var data = req.session;

		connection.connect(function(err) {
			if (err) {
				console.log(err);
			}
		});

		var query = "SELECT * FROM `Conferences` WHERE id = '" + conferenceId + "'";

		connection.query(query, function(err, results) {
			if (err) {
				console.log(err);
				connection.destroy();
				res.redirect('/');
			}

			var isOwner = false;
			if (conferenceId == data.userid) {
				isOwner = true;
			}

			var guest = data.guest || true;

			res.render('conference/conference.ejs', {guest: guest, auth: false, conference: results[0], isOwner: isOwner, moment: moment, committees: []});
		});
	},

	editConference: function(req, res) {
		var data = req.session;
		var conferenceId = req.params.conferenceId;

		connection.connect(function(err) {
			if (err) {
				console.log(err);
			}
		});

		var query = "SELECT * FROM `Conferences` WHERE id= '" + conferenceId + "' AND UserId = '" + conferenceId + "'";

		connection.query(query, function(err, results) {
			if (err) {
				console.log(err);
				connection.destroy();
				res.redirect('/');
			}

			if (results.length > 0) {
				res.render('conference/editconference.ejs', {guest: data.guest, auth: false, data: results[0]});
			} else {
				res.redirect('/conference/' + conferenceId);
			}
		});
	},

	edit: function(req, res) {
		var data = req.body;

		connection.connect(function(err) {
			if (err) {
				console.log(err);
			}
		});

		var dates = JSON.stringify([data.from, data.to]);

		var query = "UPDATE `Conferences` SET `Title` = '" + data.name + "', `Dates` = '" + dates + "', `Email` = '" + data.email + "' WHERE `id` = '" + data.id + "'";
		connection.query(query, function(err, results) {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/conferences/' + data.id);
			}
		});
	},

	addCommittee: function(req, res) {
		var conferenceId = req.params.conferenceId;
		var data = req.session;

		if (data.guest == false) {
			res.render('createcommittee', {guest: false, auth: false, conferenceId: conferenceId});
		} else {
			res.redirect('/');
		}
	},

	createCommittee: function(req, res) {
		var data = req.body;
		var sess = req.session;

		if (sess.guest == false) {
			
		}
	},

	addDelegation: function(req, res) {
		var conferenceId = req.params.conferenceId;
		var data = req.session;

		if (data.guest == false) {
			res.render('createdelegation', {guest: false, auth: false, conferenceId: conferenceId});
		} else {
			res.redirect('/');
		}
	},

	createDelegation: function(req, res) {
		var data = req.body;
		var sess = req.session;
	}

}