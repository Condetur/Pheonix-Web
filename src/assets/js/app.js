var $ = require('jquery');
var Pikaday = require('pikaday');
require('material-design-lite');

new Pikaday({field: $('.from')[0]});
new Pikaday({field: $('.to')[0]});

$('#btn1').click(function() {
	var i = $("<div class='dais'><div><label>Dais Name</label><input name='daisname' required/></div><div><label>Dais Email</label><input name='daisemail' required/></div></div>");
	$('.d').append(i);
});
$('#btn2').click(function() {
	var i = $("<div class='country'><div class='group'><div><label>Country Name</label><input name='countryname' required/></div><div><label>Delegation Name</label><input name='countrydelegationname' required/></div></div></div>");
	$('.c').append(i);
});

$('.teacheradd').click(function() {
	var i = $("<div class='teacher'><div><label>Teacher Name</label><input name='teachername' required/></div><div><label>Teacher Email</label><input name='teacheremail' required/></div></div>");
	$('.t').append(i);
});

$('.studentadd').click(function() {
	var i = $("<div class='student'><div><label>Student Name</label><input name='studentname' required/></div><div><label>Student Email</label><input name='studentemail' required/></div></div>");
	$('.s').append(i);
});

$('.toggle-teachers').click(function() {
	var el = $(this);
	var parent = el.parent().parent();
	var target = parent.find('.teachers');
	
	if (target.hasClass('active')) {
		target.removeClass('active');
		el.removeClass('down');
	} else {
		target.addClass('active');
		el.addClass('down');
	}
});