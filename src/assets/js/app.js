var $ = require('jquery');
var Pikaday = require('pikaday');
require('material-design-lite');

new Pikaday({field: $('.from')[0]});
new Pikaday({field: $('.to')[0]});

//$('#btn1').click(function() {
	//var i = $("<div class='dais'><div><label>Dais Name</label><input name='daisname' required/></div><div><label>Dais Email</label><input name='daisemail' required/></div></div>");
	//$('.d').append(i);
//});
//$('#btn2').click(function() {
	//var i = $("<div class='student'><div class='group'><div><label>Student Name</label><input name='studentname[]' required/></div><div><label>Student Email</label><input name='studentemail[]' required/></div></div><div><label>Student School</label><input name='studentschool[]' required/></div>")
	//$('.s').append(i);
//});

$('.teacheradd').click(function() {
	var i = $("<div class='teacher'><div><label>Teacher Name</label><input name='teachername' required/></div><div><label>Teacher Email</label><input name='teacheremail' required/></div></div>");
	$('.t').append(i);
});

$('.toggle-teachers').click(function() {
	if ($('.content.teachers').hasClass('active')) {
		$('.content.teachers').removeClass('active');
		$('.toggle-teachers').removeClass('down');
	} else {
		$('.content.teachers').addClass('active');
		$('.toggle-teachers').addClass('down');
	}
});