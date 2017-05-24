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

function getStudentsFromDelegation(delegationId, callback) {
	var out = [];
	var query = "SELECT * FROM `Student` WHERE `delegationId` = '" + delegationId + "'";

	connection.query(query, function(err, res) {
		if (err) {
			out = [];

			callback(out)
		} else {
			out = res;

			var ss = [];

			out.forEach(function(el) {
				var d = {name: el.Name, email: el.Email};
				ss.push(d);
			});

			callback(ss);
		}
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

function getDebates(conferenceId, callback) {
	var out = [];

	var query = "SELECT * FROM `ModeratedCaucus` WHERE `ConferenceId` = '" + conferenceId + "'";

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
			if (data.userid == results[0].UserId) {
				isOwner = true;
			}

			var guest;

			if (data.guest != null) {
				if (data.guest == false) {
					guest = false;
				} else {
					guest = true;
				}
			} else {
				guest = true;
			}

			getDelegations(conferenceId, function(resu) {
				var delegationInfo = resu;
				var delegations = [];

				delegationInfo.forEach(function(el) {
					getStudentsFromDelegation(el.id, function(res) {
						var teachers = JSON.parse(el.Teachers);
						var d = {teachers: teachers, name: el.Name, id: el.id, students: res};
						delegations.push(d);
					});
				});

				getCommittees(conferenceId, function(resul) {
					var committeeData = resul;
					var committees = [];

					committeeData.forEach(function(el) {
						var chair = JSON.parse(el.ChairInfo);

						var daisInfo = JSON.parse(el.DaisInfo);
						var dais = [];
						daisInfo.forEach(function(d) {
							dais.push(d);
						});

						var countryInfo = JSON.parse(el.Countries);
						var countries = [];
						countryInfo.forEach(function(c) {
							countries.push(c);
						});

						var c = {name: el.Name, chair, dais: dais, countries: countries, id: el.id};

						committees.push(c);
					});

					getDebates(conferenceId, function(result) {
						var debateData = result;
						var debates = [];

						debateData.forEach(function(el) {
							
						});
					});
					
					res.render('conference/conference.ejs', {guest: guest, auth: false, conference: results[0], isOwner: isOwner, moment: moment, delegations: delegations, committees: committees});
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
			var query = "SELECT * FROM `Delegation` WHERE `ConferenceId` = '" + conferenceId + "'";

			connection.query(query, function(err, results) {
				if (err) {
					res.redirect('/conferences/' + conferenceId);
				} else {
					var delegations = results;

					res.render('createcommittee', {guest: false, auth: false, conferenceId: conferenceId, delegations: delegations});
				}
			});
		} else {
			res.redirect('/');
		}
	},

	createCommittee: function(req, res) {
		var data = JSON.parse(req.body.data)[0];
		var sess = req.session;

		if (sess.guest == false) {
			var countries = [];
			var dais = [];

			if (data.countries) {
				if (data.countries.constructor == Array) {
					data.countries.forEach(function(el) {
						var name = el.name;

						countries.push(name);
					});
				} else {
					countries = [data.countries[0].name];
				}
			}

			if (data.dais) {
				if (data.dais.constructor == Array) {
					data.dais.forEach(function(el) {
						var d = {name: el.name, email: el.email};

						dais.push(d);
					});
				} else {
					dais = [{name: data.dais.name, email: data.dais.email}];
				}
			}

			var query = "INSERT INTO `Committee`(`ConferenceId`, `ChairInfo`, `DaisInfo`, `Countries`, `Name`) VALUES ('" + data.conferenceId + "', '" + JSON.stringify(data.chair) + "', '" + JSON.stringify(dais) + "', '" + JSON.stringify(countries) + "', '" + data.name + "')";

			connection.query(query, function(err, results) {
				if (err) {
					console.log(err);
				} else {
					if (data.countries.constructor == Array) {
						data.countries.forEach(function(el) {
							var students = el.students;

							students.forEach(function(stu) {
								var query = "UPDATE `Student` SET `Country` = '" + el.name + "', `committeeId` = '" + results.insertId + "' WHERE `id` = '" + stu.id + "'";

								connection.query(query, function(err, results) {
									if (err) {
										throw err;
									}
								});
							});	
						});
					}
					
					res.send(true);
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
			}

			if (data.studentname.constructor == Array) {
				var x = 0;

				while (data.studentname[x]) {
					var query = "INSERT INTO `Student`(`delegationId`, `Name`, `Email`) VALUES ('" + results.insertId + "', '" + data.studentname[x] + "', '" + data.studentemail[x] + "')";

					connection.query(query, function(err, results) {
						if (err) {
							console.log(err);
							res.redirect('/');
							throw err;
						}
					})

					x++;	
				}

				res.redirect('/conferences/' + conferenceId);
			} else {
				var query = "INSERT INTO `Student`(`delegationId`, `Name`, `Email`) VALUES ('" + results.insertId + "', '" + data.studentname + "', '" + data.studentemail + "')";

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
		});
	},

	// Get students from name of delegation
	getStudents(req, res) {
		var data = req.body;

		var query = "SELECT * FROM `Delegation` WHERE `ConferenceId` = '" + data.id + "' AND `Name` = '" + data.name + "'";

		connection.query(query, function(err, results) {
			if (err) {
				res.send([false]);
			} else {
				if (results[0]) {
					var query = "SELECT * FROM `Student` WHERE `delegationId` = '" + results[0].id + "'";

					connection.query(query, function(err, results) {
						if (err) {
							res.send([false]);
						} else {
							res.send(results);
						}
					});
				} else {
					res.send([false]);
				}
			}
		});
	},

	addDebate(req, res) {
		var conferenceId = req.params.conferenceId;
		var sess = req.session;

		var query = "SELECT * FROM `Conferences` WHERE id = '" + conferenceId + "'";

		connection.query(query, function(err, results) {
			if (err) {
				throw err;
			}

			if (sess.userid == results[0].UserId) {
				var isOwner = true;

				res.render('createdebate.ejs', {guest: false, auth: false, conferenceId: conferenceId});
			}
		});
	},

	getCommitteesFromId(req, res) {
		var conferenceId = req.body.conferenceId;

		var query = "SELECT * FROM `Committee` WHERE `ConferenceId` = '" + conferenceId + "'";

		connection.query(query, function(err, results) {
			if (err) {
				res.send(false);

				throw err;
			}

			res.send(results);
		});
	},

	getStudentsFromCommitteeId(req, res) {
		var committeeId = req.body.committeeId;
		console.log(committeeId);

		var query = "SELECT * FROM `Student` WHERE `committeeId` = '" + committeeId + "'";

		connection.query(query, function(err, results) {
			if (err) {
				res.send(false);

				throw err;
			}

			console.log(results);
			res.send(results);
		});
	},

	createDebate(req, res) {
		var data = JSON.parse(req.body.data);
		var committees = data.committees;
		var students = [];

		committees.forEach(function(el) {
			var s = el.students;

			s.forEach(function(el) {
				students.push(el);
			});
		});

		students = JSON.stringify(students);

		var query = "INSERT INTO `ModeratedCaucus`(`Speaches`, `Name`, `ConferenceId`, `Type`) VALUES('" + students + "', '" + data.Name + "', '" + data.id + "', '" + data.type + "')";

		connection.query(query, function(err, results) {
			if (err) {
				res.send(false);

				console.log(err);

				throw err;
			} else {
				res.send(true);
			}
		});
	}

}