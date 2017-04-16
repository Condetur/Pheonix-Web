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

		res.render('createconference.ejs', {title: 'Pheonix', guest: guest, auth: true});
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
	}

}