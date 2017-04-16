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
			res.render('auth/register.ejs', {guest: guest, title: 'Pheonix', auth: true})
		} else {
			res.redirect('/@me');
		}
	},

	register: function(req, res) {
		var data = req.body;
		var sess = req.session;

		connection.connect(function(err) {
			if (err) {
				res.send('There has been an error, try again');
			}
		});

		var query = "INSERT INTO `Users`(`Email`, `Password`, `Name`) VALUES ('" + data.email + "', '" + data.password + "', '" + data.name + "')";

		connection.query(query, function(err, results) {
			if (err) {
				res.send('There has been an error!');
				connection.destroy();
			} else {
				sess.guest = false;
				sess.userid = results.insertId;
				res.redirect('http://localhost:3000/@me');

				connection.destroy();
			}
		});
	}
	
}