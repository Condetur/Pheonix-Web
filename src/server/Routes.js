module.exports = {

	Routes: [
		['get', '/', 'Home@index'],
		['get', '/register', 'Auth/Register@index'],
		['get', '/login', 'Auth/Login@index'],
		['get', '/@me', 'Home@home'],
		['get', '/create/conference','Conference@index'],
		['get', '/conferences/:conferenceId', 'Conference@home'],
		['get', '/conferences/:conferenceId/addcommittee', 'Conference@addCommittee'],
		['get', '/conferences/:conferenceId/edit', 'Conference@editConference'],

		['post', '/user/register', 'Auth/Register@register'],
		['post', '/user/login', 'Auth/Login@login'],
		['post', '/conference/create', 'Conference@create'],
		['post', '/conference/update', 'Conference@edit']
	]
	
}