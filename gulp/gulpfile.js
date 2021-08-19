/**
 * gulpfile.js
 * @creation: 20018.??.??
 * @update  : 2021.08.17
 * @version : 2.7.0
 *
 * @license Copyright (C) 2021 Taichi Matsutaka
 */
///////////////////////////////////////////////////////////////
// variable
///////////////////////////////////////////////////////////////

/* Project path.
------------------ */
const devRoot   = '../dev_html/'; // Path to dev webroot.
const devAssets = devRoot + 'assets' + '/'; // Path to dev assets.
const devImg    = devAssets + 'img' + '/'; // Path to project original img.
const devSprite = devAssets + 'sprite' + '/'; // Path to project original svg.
const devSass   = devAssets + 'sass' + '/'; // Path to project sass.
const devScript = devAssets + 'js' + '/'; // Path to project original js.
const devHtml   = devRoot; // Path to project original html.
const devWp     = devRoot + 'wp' + '/'; // Path to project original wordpress.

const projectRoot   = '../../public_html/'; // Path to project webroot.
const projectAssets = projectRoot + 'assets' + '/'; // Path to project assets.
const projectImg    = projectAssets + 'img' + '/'; // Path to project img.
const projectSprite = projectAssets + 'sprite' + '/'; // Path to project svg.
const projectCss    = projectAssets + 'css' + '/'; // Path to project css.
const projectScript = projectAssets + 'js' + '/'; // Path to project javascript.
const projectHtml   = projectRoot; // Path to project HTML.
const projectWp     = projectRoot + 'wp' + '/'; // Path to project wordpress.


/* gulp
------------------ */
// Gulp.
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








///////////////////////////////////////////////////////////////
// Pug
///////////////////////////////////////////////////////////////
const pugTask = () => {
	return gulp
		.src( devHtml + '**/!(_|#)*.pug' )
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
		.pipe( gulp.dest( projectHtml ) );
}
exports.pug = pugTask;





///////////////////////////////////////////////////////////////
// EJS
///////////////////////////////////////////////////////////////
const ejsTask = () => {
	return gulp
		.src( devHtml + '**/!(_|#)*.ejs' )
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
		.pipe( gulp.dest( projectHtml ) );
}
exports.ejs = ejsTask;





///////////////////////////////////////////////////////////////
// sass
///////////////////////////////////////////////////////////////
const sassTask = ( done ) => {
	gulp
		.src( devSass + '**/*.scss')
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( bulkSass() )
		.pipe( sass({
			outputStyle: 'expanded',
			indentWidth: 1,
			indentType : 'tab',
		}) )
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
		.pipe( gulp.dest(projectCss) );

	/* ----- No task runner ----- */
	// gulp
	// 	.src( devSass + '**/*.scss')
	// 	.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
	// 	.pipe( bulkSass() )
	// 	.pipe( sass({
	// 		outputStyle: 'expanded',
	// 		indentWidth: 1,
	// 		indentType : 'tab',
	// 	}) )
	// 	.pipe( autoprefixer({
	// 		grid: true,
	// 		cascade: false,
	// 		remove: true,
	// 		overrideBrowserslist: [
	// 			'> 1% in JP',
	// 			'last 1 version',
	// 			'Firefox ESR'
	// 		]
	// 	}) )
	// 	.pipe( gulp.dest(projectCss) );

	done();
}
exports.sass = sassTask;





///////////////////////////////////////////////////////////////
// imageMin
///////////////////////////////////////////////////////////////
const devImgFile    = devImg + '**/!(_|#|apng|webp-)*.+(jpg|jpeg|png|gif)';
const devWebpFile   = devImg + '**/webp-*.+(jpg|jpeg|png|gif)';
const devImgSvgFile = devImg + '**/!(_|#)*.svg';

const imgTask = ( done ) => {
	/* ----- jpg,png,gif ----- */
	gulp
		.src( devImgFile )
		.pipe( changed( projectImg ) )
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
		.pipe( gulp.dest( projectImg ) );


	/* ----- img/*.svg ----- */
	gulp
		.src( devImgSvgFile )
		.pipe( changed( projectImg ) )
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
		.pipe( gulp.dest( projectImg ) );



	/* ----- webp ----- */
	// gulp
		.src( devWebpFile )
		.pipe( changed( projectImg , {
			transformPath: function( newPath ) {
				const path = newPath.replace( 'webp-', '' );
				return path;
			}
		}) )
		.pipe( webp() )
		.pipe(rename(function (path) {
			// ファイル名から「webp-」を削除
			var basename = path.basename;
			var filename = basename.replace( 'webp-', '' );
			path.basename = filename;
		}))
		.pipe( gulp.dest( projectImg ) );

	gulp
		.src( devWebpFile )
		.pipe( changed( projectImg , {
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
		.pipe(rename(function (path) {
			// ファイル名から「webp-」を削除
			var basename = path.basename;
			var filename = basename.replace( 'webp-', '' );
			path.basename = filename;
		}))
		.pipe( gulp.dest( projectImg ) );


	done();
}

exports.img = imgTask;





///////////////////////////////////////////////////////////////
// spriteTask
///////////////////////////////////////////////////////////////
const devSpriteFile = devSprite + '**/!(_|#)*.svg';

const spriteTask = ( done ) => {

	/* ----- sprite/parts ----- */
	/* 開発ディレクトリを使わない会社用に、public_htmlにもpartsディレクトリで圧縮した個別のsvgファイルを追加 */
	gulp
		.src( devSpriteFile )
		.pipe( changed( projectSprite ) )
		.pipe( imagemin([
			imagemin.svgo( { plugins: [ { removeViewBox: false } ] } ),
		],{
			verbose: true
		}) )
		.pipe( gulp.dest( projectSprite + 'parts/' ) );


	/* ----- sprite.svg ----- */
	gulp
		.src( devSpriteFile )
		.pipe( changed( projectSprite ) )
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
		.pipe( gulp.dest( projectSprite ) );

	done();
}

exports.sprite = spriteTask;




///////////////////////////////////////////////////////////////
// javascriptMin
///////////////////////////////////////////////////////////////
const jsTask = ( done ) => {
	/* ----- basic ----- */
	gulp
		.src( devScript + '!(_|#|*.min)*.js' )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( uglify({ output: {comments: 'some'} }) )
		.pipe( rename({extname: '.min.js'}) )
		.pipe( gulp.dest( projectScript ));


	/* ----- move ----- */
	gulp
		.src( devScript + '**.min.js' )
		.pipe( changed( projectScript ) )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( gulp.dest( projectScript ));


	/* ----- library ----- */
	gulp
		.src( devScript + 'library/*.js' )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( concat('library.js') )
		.pipe( gulp.dest( projectScript ));

	gulp
		.src( devScript + 'jquery-library/*.js' )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( concat('jquery-library.js') )
		.pipe( gulp.dest( projectScript ));


	/* ----- module ----- */
	gulp
		.src( devScript + 'module/*.js' )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( concat('module.js') )
		.pipe( uglify({ output: {comments: 'some'} }) )
		.pipe( rename({extname: '.min.js'}) )
		.pipe( gulp.dest( projectScript ));


	/* ----- No task runner ----- */
	// gulp
	// 	.src( devScript + '!(_|#|*.min)*.js' )
	// 	.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
	// 	.pipe( gulp.dest( projectScript ));

	// gulp
	// 	.src( devScript + 'module/*.js' )
	// 	.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
	// 	.pipe( concat('module.js') )
	// 	.pipe( gulp.dest( projectScript ));


	done();
}

exports.js = gulp.series(
	gulp.parallel( jsTask )
);





///////////////////////////////////////////////////////////////
// move
///////////////////////////////////////////////////////////////
const devMove = [
	devHtml + '**/!(_|#)*.+(php|css|mp4|mp3|mov|m4a|txt|pdf|ttf|eot|woff|woff2|ico|webp)',
	devHtml + '**/!(_|#)apng*.+(png)',
];

const moveTask = () => {
	return gulp
		.src( devMove )
		.pipe( changed( projectHtml ) )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( gulp.dest( projectHtml ) );
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
		+ "\n" + '   @version : 2.6.0'
		+ "\n" + '   @gulp    : 4.0.2'
		+ "\n" + '   @node    : 14.14.0'
		+ "\n"
		+ "\n" + '   Copyright (C) 2021 Taichi Matsutaka'
		+ "\n"
		+ "\n" + '------------------------------------------------- Now Watching --'
		+ "\n"
	);

	gulp.watch( devRoot + '**/*.pug' , gulp.parallel( pugTask ) );
	gulp.watch( devRoot + '**/*.ejs' , gulp.parallel( ejsTask ) );
	gulp.watch( devSass + '**/*.scss' , gulp.parallel( sassTask ) );
	gulp.watch( devScript + '**/*.js' , gulp.parallel( jsTask ) );
	gulp.watch( devImg + '**/*.+(jpg|jpeg|png|gif|svg)' , gulp.parallel( imgTask ) );
	gulp.watch( devSprite + '**/*.svg' , gulp.parallel( spriteTask ) );
	gulp.watch( devMove , gulp.parallel( moveTask ) );
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




