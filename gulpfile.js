const gulp = require('gulp');
const sass = require('gulp-sass');
const browsersync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const imageMin = require('gulp-imagemin');
const cache = require('gulp-cache');
const bourbon = require('node-bourbon');
const notify = require('gulp-notify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

function scripts(done) {

	gulp.src(['app/js/main.js']).pipe(concat('scripts.min.js')).pipe(uglify()).pipe(gulp.dest('app/js')).pipe(browsersync.reload({stream: true}));
	done();
}

function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: 'app'
		},
		port: 3000
	});
	done();
}

function css(done) {
	gulp.src('app/sass/**/*.scss').pipe(sass({includePaths: bourbon.includePaths})).on('error', notify.onError()).pipe(gulp.dest('app/css')).pipe(rename({
		suffix: '.min',
		prefix: ''
	})).pipe(postcss([autoprefixer(), cssnano()])).pipe(gulp.dest('app/css')).pipe(browsersync.reload({stream: true}));
	done();
}

function imagemin(done) {
	gulp.src('app/img').pipe(cache(imageMin())).pipe(gulp.dest('dist/img'));
	done();
}

function clean(done) {
	del.sync('dist');
	done();
}

function watchFiles() {
	gulp.watch('app/sass/**/*.sass', css);
	gulp.watch('app/sass/**/*.scss', css);
	gulp.watch('app/js/main.js', scripts);
	gulp.watch('app/*.html', browsersync.reload);
}


function buildFiles(done) {
	gulp.src([
		'app/*.html',
		// 'app/.htaccess',
	]).pipe(gulp.dest('dist'));
	done();
}

function buildCss(done) {
	gulp.src([
		'app/css/main.min.css',
	]).pipe(gulp.dest('dist/css'));
	done();
}

function buildJs(done) {
	gulp.src([
		'app/js/scripts.min.js',
	]).pipe(gulp.dest('dist/js'));
	done();
}

function buildFonts(done) {
	gulp.src([
		'app/fonts/**/*',
	]).pipe(gulp.dest('dist/fonts'));
	done();
}

function buildImages(done) {
	gulp.src([
		'app/img/**/*',
	]).pipe(gulp.dest('dist/img'));
	done();
}

gulp.task('build', gulp.series(clean, css, scripts, buildFiles, buildCss, buildJs, buildFonts, buildImages, imagemin));
gulp.task('watch',  gulp.parallel(watchFiles, browserSync));

