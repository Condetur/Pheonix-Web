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
		var i = countryTemplate.clone();
		var length = $('.countryname').length;

		var x = ("<input hidden name='split " + $('.countryname')[length - 1] + "'/>");
		i.find('.countrydelegationname').change(getDelegationsFromSelect);

		console.log(i);
		$('.c').append(i);
		i.append(x);
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

	if ($('.createdebate')) {
		getCommitteesForDebate();

		$("#debatetype").change(showProperDebateType);
	}
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

				var e = $("<div class='student'><input type='checkbox' class='studentselected' name='studentselected' value='" + res[i].id +"'/><span id='name' class='name'>" + res[i].Name + "</span></div>");
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
		var el = $(value);

		var d = {name: el.find('.daisname').val(), email: el.find('.daisemail').val()};

		dais.push(d);
	});

	var countries = [];

	$('.country').each(function(index, value) {
		var el = $(value);

		var name = el.find('.countryname').val();
		var delegationName = el.find('.countrydelegationname').val();

		var students = [];

		el.find('.studentselected').each(function(index, value) {
			var el = $(value);

			if (el.is(':checked')) {
				var s = {id: el.val()};
				
				students.push(s);
			}
		});

		var c = {name: name, delegationName: delegationName, students: students};

		countries.push(c);
	});

	var data = {name: $('.committeename').val(), chair: chairData, dais: dais, countries: countries, conferenceId: $('#id').val()};

	$.ajax({
		type: 'POST',
		url: '/committee/create',
		data: {data: JSON.stringify([data])},
		success: function(res) {
			console.log('foo');
			if (res) {
				location.href = '/@me';
			}
		},
		error: function(res) {
		}
	});
}

$('.createcommittee').submit(handleCommitteeCreation);

function getCommitteesForDebate() {
	var conferenceId = $('#id').val();

	$.ajax({
		type: 'POST',
		url: '/committee/getcommittees',
		data: {conferenceId: conferenceId},
		success: function(res) {
			if (res) {
				res.forEach(function(el) {
					var el = $("<div class='committee'><label class='name'>" + el.Name + "</label><div class='group'><label>Attending: </label><input type='checkbox' value='" + el.id + "' id='committeeselected'/><div class='studentresults'></div></div></div>");

					el.find('#committeeselected').change(handleCommitteeSelected);

					$('.committeeresults').append(el);
				});
			}
		}
	});
}

function handleCommitteeSelected(e) {
	var el = $(e.currentTarget);
	var committeeNode = el.parent().parent();

	var committeeId = el.val();

	getStudentsFromCommitteeId(committeeId, committeeNode);
}

function getStudentsFromCommitteeId(id, node) {
	var conferenceId = $('#id').val();
	console.log('foo');

	$.ajax({
		type: 'POST',
		url: '/student/getstudents',
		data: {committeeId: id},
		success: function(res) {
			if (res) {
				res.forEach(function(el) {
					var el = $("<div class='student'><label class='name'>" + el.Name + "</label><div class='group'><label>Participating: </label><input type='checkbox' value='" + el.id + "' id='studentselected'/></div><div class='group'><label>Timing of Speech(minutes):</label><input id='studenttiming'/></div></div>");
					var caucus = $("<div class='student'><label class='name'>" + el.Name + "</label><div class='group'><label>Participating: </label><input type='checkbox' value='" + el.id + "' id='studentselected'/></div></div>");
				
					if (node.parent().parent().hasClass('unmodcaucus')) {
						node.find('.studentresults').append(caucus);
					} else {
						node.find('.studentresults').append(el);
					}
				});
			}
		}
	});
}

function showProperDebateType(e) {
	if (e.currentTarget.value == 'Moderated Caucus') {
		$('.modcaucus').addClass('show');
		$('.speakerslist').removeClass('show');
		$('.unmodcaucus').removeClass('show');
	} else if (e.currentTarget.value == 'Speakers List') {
		$('.modcaucus').removeClass('show');
		$('.speakerslist').addClass('show');
		$('.unmodcaucus').removeClass('show');
	} else if (e.currentTarget.value == 'Un-moderated Caucus') {
		$('.modcaucus').removeClass('show');
		$('.speakerslist').removeClass('show');
		$('.unmodcaucus').addClass('show');
	}
}

$('.createdebate').submit(handleDebateSubmit);

function handleDebateSubmit(e) {
	e.preventDefault();

	var debateName = document.getElementById('debatename').value;
	var type = $('#debatetype').val();

	var node = $('.type.show');
	var results = node.find('.committeeresults');
	var committeeNodes = results.find('.committee');
	var committees = [];

	committeeNodes.each(function(index, value) {
		var el = $(value);

		var participating = el.find('#committeeselected').is(':checked');

		if (participating) {
			var name = el.find('.name').html();

			var studentNodes = el.find('.student');
			var students = [];

			studentNodes.each(function(index, value) {
				var el = $(value);

				var attending = el.find('#studentselected').is(':checked');

				if (attending) {
					var name = el.find('.name').html();
					var speechTiming = el.find('#studenttiming').val();

					var s = {name: name, speechTiming: speechTiming};

					students.push(s);
				}
			});

			var c = {name: name, students: students};
			committees.push(c);
		}
	});

	var data = {
		committees: committees,
		name: debateName,
		type: type,
		id: $('#id').val()
	};
	data = JSON.stringify(data);

	$.ajax({
		type: 'POST',
		url: '/debate/add',
		data: {data: data},
		success: function(res) {
			if (res) {
				location.href = '/@me';
			}
		}
	});
}