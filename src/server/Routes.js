module.exports = {

	Routes: [
		['get', '/', 'Home@index'],
		['get', '/register', 'Auth/Register@index'],
		['get', '/login', 'Auth/Login@index'],
		['get', '/@me', 'Home@home'],
		['get', '/create/conference','Conference@index'],

		['post', '/user/register', 'Auth/Register@register'],
		['post', '/user/login', 'Auth/Login@login'],
		['post', '/controller/create', 'Conference@create']
	]
	
}