var $ = require('jquery');
var Pikaday = require('pikaday');
require('material-design-lite');

$(document).ready(function() {
	new Pikaday({field: $('.from')[0]});
	new Pikaday({field: $('.to')[0]});

	$('#btn1').click(function() {
		var i = $("<div class='dais'><div><label>Dais Name</label><input name='daisname' required/></div><div><label>Dais Email</label><input name='daisemail' required/></div></div>");
		$('.d').append(i);
	});
	$('#btn2').click(function() {
		var i = countryTemplate;

		i.find('.countrydelegationname').change(getDelegationsFromSelect);

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
	$('.toggle-students').click(function() {
		var el = $(this);
		var parent = el.parent().parent();
		var target = parent.find('.students');
		
		if (target.hasClass('active')) {
			target.removeClass('active');
			el.removeClass('down');
		} else {
			target.addClass('active');
			el.addClass('down');
		}
	});

	var countryTemplate = $('.country').clone();

	$('.countrydelegationname').change(getDelegationsFromSelect);
});

function getDelegationsFromSelect() {
	var el = $(this);
	var parent = el.parent().parent().parent().parent();
	var target = parent.find('.studentssearch');

	target.find('.list').empty();
	target.find('.spinner').removeClass('hidden');

	target.removeClass('hidden');

	var committeeId = $('.idhidden').val();
	var delegationName = el.val();

	$.ajax({
		method: 'POST',
		url: '/committee/getstudents',
		data: {
			id: committeeId,
			name: delegationName
		},
		success: function(res) {
			for (var i = 0; i < res.length; i++) {
				$('.spinner').addClass('hidden');

				var e = $("<div class='student'><input type='checkbox' name='studentselected'/><span class='name'>" + res[i].Name + "</span></div>");
				target.find('.list').append(e);
			}

			target.find('.list').removeClass('hidden');
		},
		error: function(res) {

		}
	});
}