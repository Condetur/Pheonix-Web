var $ = require('jquery');
var Pikaday = require('pikaday');
require('material-design-lite');

new Pikaday({field: $('.from')[0]});
new Pikaday({field: $('.to')[0]});

$('#btn1').click(function() {
	var i = $("<div class='dais'><div><label>Dais Name</label><input name='daisname[]' required/></div><div><label>Dais Email</label><input name='daisemail[]' required/></div></div>");
	$('.d').append(i);
});
$('#btn2').click(function() {
	var i = $("<div class='student'><div class='group'><div><label>Student Name</label><input name='studentname[]' required/></div><div><label>Student Email</label><input name='studentemail[]' required/></div></div><div><label>Student School</label><input name='studentschool[]' required/></div>")
	$('.s').append(i);
});