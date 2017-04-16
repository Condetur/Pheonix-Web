var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Tino0211',
	database: 'Pheonix'
});

module.exports = {

	index: function(req, res) {
		var guest;
		var data = req.session;

		if (data && data.guest) {
			guest = guest;
		} else {
			guest = true;
		}

		if (guest) {
			res.render('login.ejs', {guest: guest, title: 'Pheonix', auth: true})
		} else {
			res.redirect('/@me');
		}
	},

	login: function(req, res) {
		var data = req.body;
		var sess = req.session;

		connection.connect(function(err) {
			if (err) {
				res.send('There has been an error');
			}
		});

		var query = "SELECT * FROM `Users` WHERE Email = '" + data.email + "' AND Password = '" + data.password + "'";

		connection.query(query, function(err, results) {
			if (err) {
				res.send('There has been an error');
			} else {
				sess.guest = false;
				sess.userid = results[0].id;
				console.log(sess);
				res.redirect('http://localhost:3000/@me');
			}
		});
	}

}