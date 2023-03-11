/**
 * gulpfile.js
 * @ url    : https://github.com/taichaaan/tpl-gulpfile/
 * @creation: 2018.??.??
 * @update  : 2022.04.19
 * @version : 2.11.0
 *
 * @license Copyright (C) 2022 Taichi Matsutaka
 */
///////////////////////////////////////////////////////////////
// variable
///////////////////////////////////////////////////////////////

///////////////////////////////////////////
// options
///////////////////////////////////////////
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
		html  : '../dev_html/', // Path to project original html.
	},
	publicPath: {
		root  : '../../public_html/',// Path to project webroot.
		assets: '../../public_html/assets/',// Path to project assets.
		img   : '../../public_html/assets/img/',// Path to project img.
		sprite: '../../public_html/assets/sprite/',// Path to project svg.
		css   : '../../public_html/assets/css/',// Path to project css.
		script: '../../public_html/assets/js/',// Path to project javascript.
		html  : '../../public_html/',// Path to project HTML.
	},
}



///////////////////////////////////////////
// gulp
/////////////////////////////////////////////
const gulp = require('gulp');

// common
const sourcemaps = require('gulp-sourcemaps');
const plumber    = require('gulp-plumber'); // Do not stop watch even if an error occurs.
const notify     = require('gulp-notify'); // Display notification on desktop.
const rename     = require('gulp-rename'); // File rename.
const concat     = require('gulp-concat'); // Combine multiple file.
const del        = require('del');
const header     = require('gulp-header'); // header comment
const replace    = require('gulp-replace');


// Sass plugin.
const sass         = require('gulp-sass'); // Sass compile.
const autoprefixer = require('gulp-autoprefixer'); // Autoprefixer.
const bulkSass     = require('gulp-sass-bulk-import'); // Import at a stretch.
const gcmq         = require('gulp-group-css-media-queries');
const cleanCSS     = require("gulp-clean-css");

// Minify Images plugin.
const changed     = require('gulp-changed'); // Check file to be updated.
const imagemin    = require('gulp-imagemin'); // Compress image.
const imageminJpg = require('imagemin-jpeg-recompress'); // Compress jpg image.
const imageminPng = require('imagemin-pngquant'); // Compress png image.
const imageminGif = require('imagemin-gifsicle'); // Compress gif image.
const webp        = require('gulp-webp'); // webp

// Sprite svg
const svgstore = require('gulp-svgstore'); // svgstore
const cheerio  = require('gulp-cheerio'); // cheerio

// Pug min
const pug          = require('gulp-pug'); // pug
const htmlComp     = require('gulp-phtml-simple-comp'); // phtml-simple-comp
const PugBeautify  = require('gulp-pug-beautify');
const htmlbeautify = require("gulp-html-beautify")

// EJS
const ejs = require('gulp-ejs');

// Minify javaScript plugin.
const uglify = require('gulp-uglify-es').default; // Compress javascript file.

// Filelist
const filelist = require('gulp-filelist');








///////////////////////////////////////////////////////////////
// Pug
///////////////////////////////////////////////////////////////
const pugTask = () => {
	return gulp
		.src( [ options.devPath.html + '!(_|#)**/**/!(_|#)*.pug' , options.devPath.html + '!(_|#)*.pug' ] )
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
exports.pug = pugTask;





///////////////////////////////////////////////////////////////
// EJS
///////////////////////////////////////////////////////////////
const ejsTask = () => {
	return gulp
		.src( [ options.devPath.html + '!(_|#)**/**/!(_|#)*.ejs' , options.devPath.html + '!(_|#)*.ejs' ] )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( ejs() )
		.pipe( htmlbeautify({
			'indent_size'          : 4,
			'indent_char'          : '\t',
			'indent_inner_html'    : true,
			'max_preserve_newlines': 0,
			'preserve_newlines'    : true,
			'max_preserve_newlines': 0,
			'extra_liners'         : [],
			'end_with_newline'     : true,
		}))
		.pipe( rename({
			extname: '.php'
		}) )
		.pipe( gulp.dest( options.publicPath.html ) );
}
exports.ejs = ejsTask;





///////////////////////////////////////////////////////////////
// sass
///////////////////////////////////////////////////////////////
const sassTask = ( done ) => {
	if ( options.type == 'min' ) {
		/* ----- basic min ----- */
		gulp
			.src( [ options.devPath.sass + '!(_|#)**/**/!(_|#)*.scss' , options.devPath.sass + '!(_|#)*.scss' ] , { sourcemaps: true } )
			.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
			.pipe( bulkSass() )
			.pipe( sass() )
			.pipe( cleanCSS() )
			.pipe( autoprefixer({
				grid: true,
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
			.src( [ options.devPath.sass + '!(_|#)**/**/!(_|#)common.scss' , options.devPath.sass + '!(_|#)common.scss' ] , { sourcemaps: true } )
			.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
			.pipe( bulkSass() )
			.pipe( sass() )
			.pipe( cleanCSS() )
			.pipe( autoprefixer({
				grid: true,
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
			.src( [ options.devPath.sass + '!(_|#)**/**/!(_|#)*.scss' , options.devPath.sass + '!(_|#)*.scss' ] , { sourcemaps: true } )
			.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
			.pipe( bulkSass() )
			.pipe( sass({
				outputStyle: 'expanded',
				indentWidth: 1,
				indentType : 'tab',
			}) )
			.pipe( autoprefixer({
				grid: true,
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
exports.sass = sassTask;





///////////////////////////////////////////////////////////////
// imageMin
///////////////////////////////////////////////////////////////
const devImgFile    = [ options.devPath.img + '!(_|#|meta)**/**/!(_|#|apng|webp-)*.+(jpg|jpeg|png|gif)' , options.devPath.img + '!(_|#|apng|webp-)*.+(jpg|jpeg|png|gif)' ];
const devWebpFile   = [ options.devPath.img + '!(_|#|meta)**/**/webp-*.+(jpg|jpeg|png|gif)' , options.devPath.img + 'webp-*.+(jpg|jpeg|png|gif)' ];
const devImgSvgFile = [ options.devPath.img + '!(_|#|meta)**/**/!(_|#)*.svg' , options.devPath.img + '!(_|#)*.svg' ];

const imgTask = ( done ) => {
	/* ----- jpg,png,gif ----- */
	gulp
		.src( devImgFile )
		.pipe( changed( options.publicPath.img ) )
		.pipe( imagemin([
			imageminPng(),
			imageminJpg(),
			imageminGif({
				interlaced: false,
				optimizationLevel: 3,
				colors:180
			})
		],{
			verbose: true
		}) )
		.pipe( gulp.dest( options.publicPath.img ) );


	/* ----- img/*.svg ----- */
	gulp
		.src( devImgSvgFile )
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
		.src( devWebpFile )
		.pipe(rename(function (path) {
			// ファイル名から「webp-」を削除
			var basename = path.basename;
			var filename = basename.replace( 'webp-', '' );
			path.basename = filename;
		}))
		.pipe( changed( options.publicPath.img , {
			transformPath: function( newPath ) {
				const path = newPath.replace( 'webp-', '' );
				return path;
			}
		}) )
		.pipe( imagemin([
			imageminPng(),
			imageminJpg(),
			imageminGif({
				interlaced: false,
				optimizationLevel: 3,
				colors:180
			})
		],{
			verbose: true
		}) )
		.pipe( gulp.dest( options.publicPath.img ) )
		.pipe( webp( {quality: 85} ) )
		.pipe( gulp.dest( options.publicPath.img ) );


	done();
}

exports.img = imgTask;





///////////////////////////////////////////////////////////////
// spriteTask
///////////////////////////////////////////////////////////////
const devSpriteFile = [ options.devPath.sprite + '!(_|#)**/**/!(_|#)*.svg' , options.devPath.sprite + '!(_|#)*.svg' ];

const spriteTask = ( done ) => {

	/* ----- sprite/parts ----- */
	/* 開発ディレクトリを使わない会社用に、public_htmlにもpartsディレクトリで圧縮した個別のsvgファイルを追加 */
	gulp
		.src( devSpriteFile )
		.pipe( changed( options.publicPath.sprite ) )
		.pipe( imagemin([
			imagemin.svgo( { plugins: [ { removeViewBox: false } ] } ),
		],{
			verbose: true
		}) )
		.pipe( gulp.dest( options.publicPath.sprite + 'parts/' ) );


	/* ----- sprite.svg ----- */
	gulp
		.src( devSpriteFile )
		.pipe( changed( options.publicPath.sprite ) )
		.pipe( imagemin([
			imagemin.svgo( { plugins: [ { removeViewBox: false } ] } ),
		],{
			verbose: true
		}) )
		.pipe( svgstore({
			inlineSvg: true,
		}) )
		.pipe( cheerio({
			run: function ($, file) {
				// 不要なタグを削除
				$('style,title,defs').remove();
				// symbolタグ以外のid属性を削除
				$('[id]:not(symbol)').removeAttr('id');
				// Illustratorで付与される「st」または「cls」ではじまるclass属性を削除
				$('[class^="st"],[class^="cls"]').removeAttr('class');
				// svgタグ以外のstyle属性を削除
				$('[style]:not(svg)').removeAttr('style');
				// data-name属性を削除
				$('[data-name]').removeAttr('data-name');
				// fill属性を削除
				$('[fill]').removeAttr('fill');
				// svgタグにdisplay:noneを付与（読み込み時、スプライト全体を非表示にするため）
				$('svg').attr({
					style: 'display:none'
				});
			},
			parserOptions: {
				xmlMode: true,
			}
		}) )
		/* 開発ディレクトリを使わない会社用に、svgをインデント */
		.pipe( htmlbeautify({
			'indent_size'          : 4,
			'indent_char'          : '\t',
			'max_preserve_newlines': 0,
			'preserve_newlines'    : false,
			'extra_liners'         : [],
			'end_with_newline'     : true
		}))
		.pipe( gulp.dest( options.publicPath.sprite ) );

	done();
}

exports.sprite = spriteTask;




///////////////////////////////////////////////////////////////
// javascriptMin
///////////////////////////////////////////////////////////////
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

exports.js = gulp.series(
	gulp.parallel( jsTask )
);





///////////////////////////////////////////////////////////////
// move
///////////////////////////////////////////////////////////////
const devMove = [
	options.devPath.html + '!(_|#)**/**/!(_|#)*.+(php|css|mp4|mp3|mov|m4a|txt|pdf|ttf|eot|woff|woff2|ico|webp)',
	options.devPath.html + '!(_|#)*.+(php|css|mp4|mp3|mov|m4a|txt|pdf|ttf|eot|woff|woff2|ico|webp)',
	options.devPath.html + '!(_|#)**/**/!(_|#)apng*.+(png)',
	options.devPath.html + '!(_|#)apng*.+(png)',
	options.devPath.html + '**/meta/**/*.+(jpg|jpeg|png|gif|svg)',
];

const moveTask = () => {
	return gulp
		.src( devMove )
		.pipe( changed( options.publicPath.html ) )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( gulp.dest( options.publicPath.html ) );
}
exports.move = moveTask;







///////////////////////////////////////////////////////////////
// watch
///////////////////////////////////////////////////////////////
const watchTask = () => {
	console.log(
		''
		+ "\n" + '-- Now Watching ------------------------------------------------'
		+ "\n"
		+ "\n" + '   @name    : gulp watch'
		+ "\n" + '   @task    : pug,ejs,sass,js,img,sprite,move'
		+ "\n" + '   @version : 2.9.0'
		+ "\n" + '   @gulp    : 4.0.2'
		+ "\n" + '   @node    : 14.14.0'
		+ "\n"
		+ "\n" + '   Copyright (C) 2021 Taichi Matsutaka'
		+ "\n"
		+ "\n" + '------------------------------------------------- Now Watching --'
		+ "\n"
	);

	gulp.watch( options.devPath.root + '**/*.pug' , gulp.parallel( pugTask ) );
	gulp.watch( options.devPath.root + '**/*.ejs' , gulp.parallel( ejsTask ) );
	gulp.watch( options.devPath.sass + '**/*.scss' , gulp.parallel( sassTask ) );
	gulp.watch( options.devPath.script + '**/*.js' , gulp.parallel( jsTask ) );
	gulp.watch( options.devPath.img + '**/*.+(jpg|jpeg|png|gif|svg)' , gulp.parallel( imgTask ) );
	gulp.watch( options.devPath.sprite + '**/*.svg' , gulp.parallel( spriteTask ) );
	gulp.watch( options.devPath.root + '**/*.+(php|css|mp4|mp3|mov|m4a|txt|pdf|ttf|eot|woff|woff2|ico|webp)' , gulp.parallel( moveTask ) );
}
exports.watch = watchTask;





///////////////////////////////////////////////////////////////
// default
///////////////////////////////////////////////////////////////
exports.default = gulp.series(
	gulp.series(
		pugTask,
		ejsTask,
		sassTask,
		jsTask,
		imgTask,
		spriteTask,
		moveTask,
		watchTask,
	)
);






