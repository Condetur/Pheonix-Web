const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const babel = require('gulp-babel');
var webpack = require('gulp-webpack');

gulp.task('default', ['less', 'js', 'watch']);

gulp.task('js', function() {
	return gulp.src('js/app.js')
		.pipe(babel({presets: ['es2015']}))
		.pipe(webpack({
			output: {filename: 'app.js'}
		}))
		.pipe(minify())
		.pipe(gulp.dest('../public/js'));
});

gulp.task('less', function() {
	return gulp.src('less/*.less')
		.pipe(less())
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest('../public/css'));
});
gulp.task('clone', function() {
	return gulp.src('img/logo.png')
		.pipe(gulp.dest('../public/img'));
});

gulp.task('watch', function() {
	gulp.watch('less/*.less', ['less']);
	gulp.watch('js/app.js', ['js']);
});

gulp.task('build', ['js', 'less', 'clone']);