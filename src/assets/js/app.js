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
		var length = $('.countryname').length

		var x = ("<input hidden name='split " + $('.countryname')[length - 1] + "'/>");
		i.find('.countrydelegationname').change(getDelegationsFromSelect);

		$('.c').append(i);
		$('.c').append
	});

	$('.teacheradd').click(function() {
		var i = $("<div class='teacher'><div><label>Teacher Name</label><input name='teachername' required/></div><div><label>Teacher Email</label><input name='teacheremail' required/></div></div>");
		$('.t').append(i);
	});

	$('.studentadd').click(function() {
		var i = $("<div class='student'><div><label>Student Name</label><input name='studentname' required/></div><div><label>Student Email</label><label name='studentemail' required/></div></div>");
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

				var e = $("<div class='student'><input type='checkbox' id='studentselected' name='studentselected' value='" + res[i].id +"'/><span id='name' class='name'>" + res[i].Name + "</span></div>");
				target.find('.list').append(e);
			}

			target.find('.list').removeClass('hidden');
		},
		error: function(res) {

		}
	});
}

function handleCommitteeCreation(e) {
	e.preventDefault()
	var chairData = [$('.chairname').val(), $('.chairemail').val()];

	var dais = [];

	$('.dais').each(function(index, value) {
		// Use index
		var el = $(index);

		var d = {name: el.find('.daisname').val(), email: el.find('.daisemail').val()};
	});

	var countries = [];

	$('.c').each(function(index, value) {
		var el = $(index);

		var name = el.find('.countryname').val();
		var delegationName = el.find('.countrydelegationname').val();

		var students = [];
		var x = 0;

		var studentselected = document.getElementById('studentselected');

		if (studentselected.constructor == Array) {
			while(studentselected[x]) {
				var s = {id: studentselected[x].value, selected: studentselected[x].checked};

				students.push(s);
				x++;
			}
		} else {
			var s = {id: studentselected.value, selected: studentselected.checked};

			students.push(s);
		}

		var c = {name: name, delegationName: delegationName, students: students};

		countries.push(c);
	});

	$.ajax({
		type: 'POST',
		url: '/committee/create',
		data: {chair: chairData, dais: dais, countries: countries, conferenceId: $('id').val()},
		success: function(res) {
			location.href = '/@me';
		},
		error: function(res) {
			location.href = '/@me';
		}
	});
}

$('.createcommittee').submit(handleCommitteeCreation);