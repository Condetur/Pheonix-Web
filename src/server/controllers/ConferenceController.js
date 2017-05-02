var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Tino0211',
	database: 'Pheonix'
});
var moment = require('moment');

connection.connect(function(err) {
	if (err) {
		console.log(err);
	}
});

function getDelegations(conferenceId, callback) {
	var out = [];
	var query = "SELECT * FROM `Delegation` WHERE `ConferenceId` = '" + conferenceId + "'";

	connection.query(query, function(err, res) {
		if (err) {
			out = [];
		} else {
			out = res;
		}

		callback(out);
	});
}

function getCommittees(conferenceId, callback) {
	var out = [];
	var query = "SELECT * FROM `Committee` WHERE `ConferenceId` = '" + conferenceId + "'";

	connection.query(query, function(err, res) {
		if (err) {
			out = [];
		} else {
			out = res;
		}

		callback(out);
	});
}

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

			if (data.guest) {
				var guest = data.guest;
			} else {
				var guest = false;
			}

			getDelegations(conferenceId, function(resu) {
				var delegations = resu;
				var teachers = [];

				delegations.forEach(function(el) {
					var t = JSON.parse(el.Teachers)[0];
					teachers.push(t);
				});

				getCommittees(conferenceId, function(resul) {
					var committeeData = resul;
					var committees = [];

					committeeData.forEach(function(el) {
						var chair = JSON.parse(el.ChairInfo)[0];

						var daisInfo = JSON.parse(el.DaisInfo);
						var dais = [];
						daisInfo.forEach(function(d) {
							dais.push(d);
						});

						var countryInfo = JSON.parse(el.Countries);
						var countries = [];
						countries.forEach(function(c) {
							countries.push(c);
						});

						var c = {chair: chair, dais: dais, countries: countries};
						committees.push(c);
					});

					res.render('conference/conference.ejs', {guest: guest, auth: false, conference: results[0], teachers: teachers[0], isOwner: isOwner, moment: moment, delegations: delegations, committees: committees});
				});
			});
		});
	},

	editConference: function(req, res) {
		var data = req.session;
		var conferenceId = req.params.conferenceId;

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
			var dais = [];

			if (data.daisname.constructor == Array) {
				var d = 0;

				while (data.daisname[d]) {
					var t = {
						daisname: data.daisname[d],
						daisemail: data.daisemail[d]
					};

					dais.push(t);

					d++;
				}
			} else {
				dais = [{daisname: data.daisname, daisemail: data.daisemail}];
			}

			dais = JSON.stringify(dais);

			chair = JSON.stringify([{name: data.chairname, email: data.chairemail}]);

			var countries = [];

			if (data.countryname.constructor == Array) {
				var x = 0;

				while (data.countryname[x]) {
					var c = {
						name: data.countryname[x],
						delegation: data.countrydelegationname[x]
					};

					countries.push(c);

					x++;
				}
			} else {
				var countries = [{
					name: data.countryname,
					delegation: data.countrydelegationname
				}];
			}

			countries = JSON.stringify(countries);

			var query = "INSERT INTO `Committee`(`ConferenceId`, `ChairInfo`, `DaisInfo`, `Countries`) VALUES('" + data.id + "', '" + chair + "', '" + dais + "', '" + countries + "')";
			
			connection.query(query, function(err, results) {
				if (err) {
					throw err;
				} else {
					res.redirect('/conferences/' + data.id);
				}
			});
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

		var conferenceId = data.id;
		var teachers = [];

		if (data.teachername.constructor == Array) {
			var t = 0;

			while (data.teachername[t]) {
				var d = {
					teachername: data.teachername[t],
					teacheremail: data.teacheremail[t]
				};

				teachers.push(d);

				t++;
			}
		} else {
			teachers = [{
				teachername: data.teachername,
				teacheremail: data.teacheremail
			}]
		}
		
		teachers = JSON.stringify(teachers);

		var cardData = {
			cardNumber: data.cardnumber,
			ccv: data.ccv,
			firstName: data.firstname,
			lastName: data.lastname,
			month: data.month,
			year: data.year
		};

		cardData = JSON.stringify(cardData);

		var query = "INSERT INTO `Delegation`(`ConferenceId`, `Name`, `NumDelegate`, `PayInfo`, `Teachers`) VALUES ('" + conferenceId + "', '" + data.name + "', '" + data.numdelegates + "', '" + cardData + "', '" + teachers + "')";

		connection.query(query, function(err, results) {
			if (err) {
				console.log(err);
				res.redirect('/');
				throw err;
			} else {
				res.redirect('/conferences/' + conferenceId);
			}
		});
	}

}