const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const babel = require('gulp-babel');

gulp.task('default', ['less', 'js', 'watch']);

gulp.task('js', function() {
	gulp.src('js/app.js')
		.pipe(babel({presets: ['es2015']}))
		.pipe(minify())
		.pipe(gulp.dest('../public/js'));
});

gulp.task('less', function() {
	gulp.src('less/*.less')
		.pipe(less())
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest('../public/css'));
});

gulp.task('watch', function() {
	gulp.watch('less/*.less', ['less']);
	gulp.watch('js/app.js', ['js']);
});