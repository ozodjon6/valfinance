// let preprocessor = 'sass', // Preprocessor (sass, less, styl); 'sass' also work with the Scss syntax in blocks/ folder.
fileswatch = 'html,htm,txt,json,md,woff2' // List of files extensions for watching & hard reload

const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const bssi = require('browsersync-ssi');
const ssi = require('ssi');
const webpack = require('webpack-stream');
const sass = require('gulp-sass');
const sassglob = require('gulp-sass-glob');
const less = require('gulp-less');
const lessglob = require('gulp-less-glob');
const styl = require('gulp-stylus');
const stylglob = require("gulp-empty");
const cleancss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const rsync = require('gulp-rsync');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
// const fileinclude  = require('gulp-file-include');
// const htmlImport   = require('gulp-html-imports');
// let pug          = require('gulp-pug');
// const gulpRsync = require('gulp-rsync')

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/',
			middleware: bssi({ baseDir: 'app/', ext: '.html' })
		},
		tunnel: 'new-safenetpay', // Attempt to use the URL https://new-safenetpay.loca.lt
		notify: false,
		online: true
	})
}

// pug
// function templates() {
//     return gulp.src('app/templates/pages/*.pug')
//         .pipe(plumber())
//         .pipe(pug({pretty: true}))
//         .pipe(dest('app/templates'));
// }

function scripts() {
	return src(['app/js/**/*.js'])
		// .pipe(webpack({
		// 	mode: 'production',
		// 	module: {
		// 		rules: [
		// 			{
		// 				test: /\.(js)$/,
		// 				exclude: /(node_modules)/,
		// 				loader: 'babel-loader',
		// 				query: {
		// 					presets: ['@babel/env'],
		// 					plugins: ['babel-plugin-root-import']
		// 				}
		// 			}
		// 		]
		// 	}
		// })).on('error', function handleError() {
		// 	this.emit('end')
		// })
		// .pipe(rename('app.js'))
		.pipe(dest('app/js'))
		.pipe(browserSync.stream())
}

function styles() {
	return src([`app/sass/**/*.scss`,
		`app/sass/bootstrap-grid.min.css`,
	])
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		.pipe(cleancss({ level: { 1: { specialComments: 0 } }, format: 'beautify' }))
		.pipe(rename({ suffix: "" }))
		.pipe(sourcemaps.write('app/css'))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function images() {
	return src(['app/images/src/**/*'])
		.pipe(newer('app/images/dist'))
		.pipe(imagemin())
		.pipe(dest('app/images/dist'))
		.pipe(browserSync.stream())
}

function buildcopy() {
	return src([
		'{app/js,app/css}/*.*',
		'app/images/**/*.*',
		'!app/images/dist/**/*',
		'app/font/**/*',
		'app/video/**/*',
		'app/landing/**/*'
		// 'app/templates/pages/*.pug'
	], { base: 'app/' })
		.pipe(dest('dist'))
}

async function buildhtml() {
	let includes = new ssi('app/', 'dist/', '/**/*.html')
	includes.compile()
	del('dist/parts', { force: true })
}

function cleandist() {
	return del('dist/**/*', { force: true })
}

function deploy() {
	return src('dist/')
		.pipe(rsync({
			root: 'dist/',
			hostname: 'username@yousite.com',
			destination: 'new-safenetpay/public_html/',
			include: [/* '*.htaccess' */], // Included files to deploy,
			exclude: ['**/Thumbs.db', '**/*.DS_Store'],
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
}

function startwatch() {
	watch(`app/sass/**/*`, { usePolling: true }, styles)
	watch(['app/js/**/*.js', '!app/js/**/*.js'], { usePolling: true }, scripts)
	watch('app/images/src/**/*.{jpg,jpeg,png,webp,svg,gif}', { usePolling: true }, images)
	watch(`app/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browserSync.reload)
	// watch(`app/pug/*.pug`, {usePolling: true}, pug)
}

exports.scripts = scripts
// exports.templates 	= templates
exports.styles = styles
exports.images = images
exports.deploy = deploy
exports.assets = series(scripts, styles, images)
exports.build = series(cleandist, scripts, styles, images, buildcopy, buildhtml)
exports.default = series(scripts, styles, images, parallel(browsersync, startwatch))