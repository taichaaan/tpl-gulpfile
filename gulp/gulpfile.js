/**
 * gulpfile.js
 * @ url    : https://github.com/taichaaan/tpl-gulpfile/
 * @creation: 2018.??.??
 * @update  : 2024.04.25
 * @version : 2.14.0
 *
 * @license Copyright (C) 2018 - 2024 Taichi Matsutaka
 */
/**************************************************************
 * variable
**************************************************************/

/******************************************
 * options
******************************************/
const options = {
	// type: 'min',
	type: 'normal',
	devPath: {
		root  : '../dev_html/', // Path to dev webroot.
		assets: '../dev_html/assets/', // Path to dev assets.
		img   : '../dev_html/assets/img/', // Path to project original img.
		sprite: '../dev_html/assets/sprite/', // Path to project original svg.
		sass  : '../dev_html/assets/sass/', // Path to project sass.
		script: '../dev_html/assets/js/', // Path to project original js.
		video: '../dev_html/assets/video/', // Path to project original video.
		html  : '../dev_html/', // Path to project original html.
	},
	publicPath: {
		root  : '../../public_html/',// Path to project webroot.
		assets: '../../public_html/assets/',// Path to project assets.
		img   : '../../public_html/assets/img/',// Path to project img.
		sprite: '../../public_html/assets/sprite/',// Path to project svg.
		css   : '../../public_html/assets/css/',// Path to project css.
		script: '../../public_html/assets/js/',// Path to project javascript.
		video : '../../public_html/assets/video/',// Path to project video.
		html  : '../../public_html/',// Path to project HTML.
	},
}



/******************************************
 * gulp
******************************************/
const gulp = require('gulp');

// common
const sourcemaps = require('gulp-sourcemaps');
const plumber    = require('gulp-plumber'); // Do not stop watch even if an error occurs.
const notify     = require('gulp-notify'); // Display notification on desktop.
const rename     = require('gulp-rename'); // File rename.
const concat     = require('gulp-concat'); // Combine multiple file.


// Sass plugin.
const sass         = require('gulp-sass'); // Sass compile.
const autoprefixer = require('gulp-autoprefixer'); // Autoprefixer.
const bulkSass     = require('gulp-sass-bulk-import'); // Import at a stretch.
const cleanCSS     = require("gulp-clean-css");

// Minify Images plugin.
const changed     = require('gulp-changed'); // Check file to be updated.
const imagemin    = require('gulp-imagemin'); // Compress image.
const imageminJpg = require('imagemin-jpeg-recompress'); // Compress jpg image.
const imageminPng = require('imagemin-pngquant'); // Compress png image.
const imageminGif = require('imagemin-gifsicle'); // Compress gif image.
const webp        = require('gulp-webp'); // webp
const cheerio     = require('gulp-cheerio'); // cheerio

// Pug min
const pug          = require('gulp-pug'); // pug
const PugBeautify  = require('gulp-pug-beautify');
const htmlbeautify = require("gulp-html-beautify")

// Minify javaScript plugin.
const uglify = require('gulp-uglify-es').default; // Compress javascript file.

// Filelist
const filelist = require('gulp-filelist');








/**************************************************************
 * Pug
**************************************************************/
const pugTask = () => {
	return gulp
		.src([
			options.devPath.html + '!(_|#)**/**/!(_|#)*.pug' ,
			options.devPath.html + '!(_|#)*.pug'
		])
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( pug({
			pretty: true
		}) )
		.pipe( PugBeautify({
			fill_tab: true,
			tab_size: 4,
			separator_space: false
		}) )
		.pipe( htmlbeautify({
			'indent_size'          : 4,
			'indent_char'          : '\t',
			'indent_inner_html'    : true,
			'max_preserve_newlines': 0,
			'preserve_newlines'    : true,
			'max_preserve_newlines': 0,
			'extra_liners'         : [],
			'end_with_newline'     : true,
			"inline"               : ['br'],
		}))
		.pipe( rename({
			extname: '.php'
		}) )
		.pipe( gulp.dest( options.publicPath.html ) );
}






/**************************************************************
 * Sass
**************************************************************/
const sassTask = ( done ) => {
	if ( options.type == 'min' ) {
		/* ----- basic min ----- */
		gulp
			.src([
				options.devPath.sass + '!(_|#)**/**/!(_|#)*.scss' ,
				options.devPath.sass + '!(_|#)*.scss'
			] ,{
				sourcemaps: true
			})
			.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
			.pipe( bulkSass() )
			.pipe( sass() )
			.pipe( cleanCSS() )
			.pipe( autoprefixer({
				cascade: false,
				remove: true,
				overrideBrowserslist: [
					'> 1% in JP',
					'last 1 version',
					'Firefox ESR'
				]
			}) )
			.pipe( rename({suffix: '.min'}) )
			.pipe( gulp.dest( options.publicPath.css , { sourcemaps:'./sourcemaps/'} ) );
	} else{
		/* ----- common min ----- */
		gulp
			.src([
				options.devPath.sass + '!(_|#)**/**/!(_|#)common.scss' ,
				options.devPath.sass + '!(_|#)common.scss'
			] ,{
				sourcemaps: true
			})
			.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
			.pipe( bulkSass() )
			.pipe( sass() )
			.pipe( cleanCSS() )
			.pipe( autoprefixer({
				cascade: false,
				remove: true,
				overrideBrowserslist: [
					'> 1% in JP',
					'last 1 version',
					'Firefox ESR'
				]
			}) )
			.pipe( rename({suffix: '.min'}) )
			.pipe( gulp.dest( options.publicPath.css , { sourcemaps:'./sourcemaps/'} ) );


		/* ----- No task runner ----- */
		gulp
			.src([
				options.devPath.sass + '!(_|#)**/**/!(_|#)*.scss' ,
				options.devPath.sass + '!(_|#)*.scss'
			] ,{
				sourcemaps: true
			})
			.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
			.pipe( bulkSass() )
			.pipe( sass({
				outputStyle: 'expanded',
				indentWidth: 1,
				indentType : 'tab',
			}) )
			.pipe( autoprefixer({
				cascade: false,
				remove: true,
				overrideBrowserslist: [
					'> 1% in JP',
					'last 1 version',
					'Firefox ESR'
				]
			}) )
			.pipe( gulp.dest( options.publicPath.css , { sourcemaps:'./sourcemaps/'} ) );
	}

	done();
}





/**************************************************************
 * Image
**************************************************************/
const imgTask = ( done ) => {
	/* ----- img/*.svg ----- */
	gulp
		.src([
			options.devPath.img + '!(_|#|meta)**/**/!(_|#)*.svg',
			options.devPath.img + '!(_|#)*.svg'
		])
		.pipe( changed( options.publicPath.img ) )
		.pipe( imagemin([
			imagemin.svgo( { plugins: [ { removeViewBox: false } ] } ),
		],{
			verbose: true
		}) )
		.pipe( cheerio({
			run: function ($, file) {
				// 不要なタグ・属性を削除
				$('title').remove();
				// $('[id]:not(symbol)').removeAttr('id');
				$('[data-name]').removeAttr('data-name');
			},
			parserOptions: {
				xmlMode: true,
			}
		}) )
		.pipe( gulp.dest( options.publicPath.img ) );


	/* ----- webp ----- */
	gulp
		.src([
			options.devPath.img + '!(_|#|meta)**/**/!(_|#|apng|webp-)*.+(jpg|jpeg|png|gif)',
			options.devPath.img + '!(_|#|apng|webp-)*.+(jpg|jpeg|png|gif)'
		])
		.pipe( changed( options.publicPath.img , { extension: '.webp' } ) )
		.pipe( webp( {quality: 85} ) )
		.pipe( gulp.dest( options.publicPath.img ) );


	/* ----- video webp ----- */
	gulp
		.src([
			options.devPath.video + '!(_|#|meta)**/**/!(_|#|apng|webp-)*.+(jpg|jpeg|png|gif)',
			options.devPath.video + '!(_|#|apng|webp-)*.+(jpg|jpeg|png|gif)'
		])
		.pipe( changed( options.publicPath.img , { extension: '.webp' } ) )
		.pipe( webp( {quality: 85} ) )
		.pipe( gulp.dest( options.publicPath.video ) );


	done();
}






/**************************************************************
 * JavaScript
**************************************************************/
const jsTask = ( done ) => {
	/* ----- move ----- */
	gulp
		.src( options.devPath.script + '**.min.js' )
		.pipe( changed( options.publicPath.script ) )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( gulp.dest( options.publicPath.script ) );


	/* ----- library ----- */
	gulp
		.src( options.devPath.script + 'library/*.js' )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( concat('library.js') )
		.pipe( gulp.dest( options.publicPath.script ) );

	gulp
		.src( options.devPath.script + 'jquery-library/*.js' )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( concat('jquery-library.js') )
		.pipe( gulp.dest( options.publicPath.script ) );


	/* ----- module ----- */
	gulp
		.src( options.devPath.script + 'module/*.js' , { sourcemaps: true } )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( concat('module.js') )
		.pipe( uglify({ output: {comments: 'some'} }) )
		.pipe( rename({extname: '.min.js'}) )
		.pipe( gulp.dest( options.publicPath.script ) , { sourcemaps: './sourcemaps/'} );


	if ( options.type == 'min' ) {
		/* ----- basic min ----- */
		gulp
			.src( options.devPath.script + '!(_|#|*.min)*.js' , { sourcemaps: true } )
			.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
			.pipe( uglify({ output: {comments: 'some'} }) )
			.pipe( rename({extname: '.min.js'}) )
			.pipe( gulp.dest( options.publicPath.script ) , { sourcemaps: './sourcemaps/'} );

	} else{
		/* ----- No task runner ----- */
		gulp
			.src( options.devPath.script + '!(_|#|*.min)*.js' )
			.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
			.pipe( gulp.dest( options.publicPath.script ) );

		gulp
			.src( options.devPath.script + 'module/*.js' )
			.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
			.pipe( concat('module.js') )
			.pipe( gulp.dest( options.publicPath.script ) );


		/* ----- filelist ----- */
		gulp
			.src( options.devPath.script + 'library/*.js' )
			.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
			.pipe( filelist('library.txt',{
				absolute: false,
				relative: true,
			}) )
			.pipe( gulp.dest( options.publicPath.script + 'filelist/' ) );

		gulp
			.src( options.devPath.script + 'jquery-library/*.js' )
			.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
			.pipe( filelist('jquery-library.txt',{
				absolute: false,
				relative: true,
			}) )
			.pipe( gulp.dest( options.publicPath.script + 'filelist/' ) );

		gulp
			.src( options.devPath.script + 'module/*.js' )
			.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
			.pipe( filelist('module.txt',{
				absolute: false,
				relative: true,
			}) )
			.pipe( gulp.dest( options.publicPath.script + 'filelist/' ) );
	}

	done();
}





/**************************************************************
 * Move
**************************************************************/
const moveTask = () => {
	return gulp
		.src([
			options.devPath.html + '!(_|#)**/**/!(_|#)*.+(php|css|mp4|mp3|mov|m4a|txt|pdf|ttf|eot|woff|woff2|ico|webp)',
			options.devPath.html + '!(_|#)*.+(php|css|mp4|mp3|mov|m4a|txt|pdf|ttf|eot|woff|woff2|ico|webp)',
			options.devPath.html + '!(_|#)**/**/!(_|#)apng*.+(png)',
			options.devPath.html + '!(_|#)apng*.+(png)',
			options.devPath.html + '**/meta/**/*.+(jpg|jpeg|png|gif|svg)',
		])
		.pipe( changed( options.publicPath.html ) )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( gulp.dest( options.publicPath.html ) );
}






/**************************************************************
 * Watch
**************************************************************/
const watchTask = () => {
	console.log(
		''
		+ "\n" + '-- Now Watching ------------------------------------------------'
		+ "\n"
		+ "\n" + '   @name    : gulp watch'
		+ "\n" + '   @task    : pug,sass,js,img,move'
		+ "\n" + '   @version : 2.14.0'
		+ "\n" + '   @gulp    : 4.0.2'
		+ "\n" + '   @node    : 14.14.0'
		+ "\n"
		+ "\n" + '   Copyright (C) 2018 - 2024 Taichi Matsutaka'
		+ "\n"
		+ "\n" + '------------------------------------------------- Now Watching --'
		+ "\n"
	);

	gulp.watch( options.devPath.root + '**/*.pug' , gulp.series( pugTask ) );
	gulp.watch( options.devPath.sass + '**/*.scss' , gulp.series( sassTask ) );
	gulp.watch( options.devPath.script + '**/*.js' , gulp.series( jsTask ) );
	gulp.watch( options.devPath.img + '**/*.+(jpg|jpeg|png|gif|svg)' , gulp.series( imgTask ) );
	gulp.watch( options.devPath.root + '**/*.+(php|css|mp4|mp3|mov|m4a|txt|pdf|ttf|eot|woff|woff2|ico|webp)' , gulp.series( moveTask ) );
}
exports.watch = watchTask;





/**************************************************************
 * Default
**************************************************************/
exports.default = gulp.series(
	gulp.parallel(
		pugTask,
		sassTask,
		jsTask,
		imgTask,
		moveTask,
	),
	watchTask,
);






