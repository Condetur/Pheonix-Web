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

		res.render('index.ejs', {title: 'Pheonix', guest: guest, auth: false});
	},

	home: function(req, res) {
		var data = req.session;
		
		if (data) {
			if (data.guest == false) {
				var userId = data.userId;

				connection.connect(function(err) {
					if (err) {
						console.log(err);
					}
				});

				var query = "SELECT * FROM Conferences WHERE UserId = '" + userId + "' ORDER BY id DESC";

				connection.query(query, function(err, results) {
					if (err) {
						console.log(err);
					}

					var results = results || [];

					res.render('home.ejs', {title: 'Pheonix', guest: false, auth: false, conferences: results});
				});
			}  else {
				res.redirect('/');
			}
		} else {
			res.redirect('/');
		}
	}

}