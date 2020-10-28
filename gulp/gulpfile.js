/**
 * gulpfile.js
 * @creation: 20018.??.??
 * @update  : 2020.10.24
 * @version : 2.0.0
 *
 * @license Copyright (C) 2020 Taichi Matsutaka
 */
///////////////////////////////////////////////////////////////
// variable
///////////////////////////////////////////////////////////////

/* Project path.
------------------ */
const devRoot   = '../dev_html/'; // Path to dev webroot.
const devAssets = devRoot + 'assets' + '/'; // Path to dev assets.
const devImg    = devAssets + 'img' + '/'; // Path to project original img.
const devSvg    = devAssets + 'svg' + '/'; // Path to project original svg.
const devSass   = devAssets + 'sass' + '/'; // Path to project sass.
const devScript = devAssets + 'js' + '/'; // Path to project original js.
const devHtml   = devRoot; // Path to project original html.
const devWp     = devRoot + 'wp' + '/'; // Path to project original wordpress.

const projectRoot   = '../../public_html/'; // Path to project webroot.
const projectAssets = projectRoot + 'assets' + '/'; // Path to project assets.
const projectImg    = projectAssets + 'img' + '/'; // Path to project img.
const projectSvg    = projectAssets + 'svg' + '/'; // Path to project svg.
const projectCss    = projectAssets + 'css' + '/'; // Path to project css.
const projectJs     = projectAssets + 'js' + '/'; // Path to project javascript.
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
const svgmin      = require('gulp-svgmin'); // Compress svg image.
const webp        = require('gulp-webp'); // webp

// Pug min
const pug         = require('gulp-pug'); // pug
const htmlComp    = require('gulp-phtml-simple-comp'); // phtml-simple-comp
const PugBeautify = require('gulp-pug-beautify');

// Minify javaScript plugin.
const uglify = require('gulp-uglify-es').default; // Compress javascript file.








///////////////////////////////////////////////////////////////
// Pug
///////////////////////////////////////////////////////////////
const pugTask = () => {
	return gulp
		.src( [ devHtml + '**/*.pug', '!' + devHtml + '**/_*.pug', '!' + devHtml + '**/#*.pug' ] )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( PugBeautify({
			fill_tab: true,
			tab_size: 4,
			separator_space: true
		}) )
		.pipe( pug({
			pretty: true
		}) )
		.pipe( htmlComp() )
		.pipe( rename({
			extname: '.php'
		}) )
		.pipe( gulp.dest( projectHtml ) );
}
exports.pug = pugTask;




///////////////////////////////////////////////////////////////
// sass
///////////////////////////////////////////////////////////////
const sassTask = () => {
	return gulp
		.src( devSass + '**/*.scss')
		// .pipe( sourcemaps.init() )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( bulkSass() )
		.pipe( sass({
			// outputStyle: 'compressed',
			// outputStyle: 'expanded',
			// indentWidth: 1,
			// indentType : 'tab',
		}) )
		// .pipe( header('@charset "UTF-8";\n\n') )
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
		// .pipe( sourcemaps.write('./') )
		.pipe( gulp.dest(projectCss) );
}
exports.sass = sassTask;





///////////////////////////////////////////////////////////////
// wp-css
///////////////////////////////////////////////////////////////
const devWpCssFile = devWp + '**/*.css';

const wpCssTask = () => {
	return gulp
		.src( devWpCssFile )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( gulp.dest( projectWp ) );
}
exports.wp_css = wpCssTask;



///////////////////////////////////////////////////////////////
// imageMin
///////////////////////////////////////////////////////////////
const devImgFile = [
	devImg + '**/*.+(jpg|jpeg|png|gif)',
	'!' + devHtml + '**/apng*.+(png)',
	'!' + devImg + '**/_*.+(jpg|jpeg|png|gif)'
];
const devImgSvgFile = devImg + '**/*.+(svg)';
const devSvgFile    = devSvg + '**/*.+(svg)';


/* ----- jpg,png,gif ----- */
const imgMinifiTask = () => {
	return gulp
		.src( devImgFile )
		.pipe( changed( projectImg ) )
		.pipe(imagemin([
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
}
exports.imgMinifi = imgMinifiTask;

/* ----- img/*.svg ----- */
const imgSvgMinifiTask = () => {
	return gulp
		.src( devImgSvgFile )
		.pipe( changed( projectImg ) )
		.pipe( svgmin() )
		.pipe( gulp.dest( projectImg ) );
}
exports.imgSvgMinifi = imgSvgMinifiTask;

/* ----- svg/*.svg ----- */
const svgMinifiTask = () => {
	return gulp
		.src( devSvgFile )
		.pipe( changed( projectSvg ) )
		.pipe( svgmin() )
		.pipe( gulp.dest( projectSvg ) );
}
exports.svgMinifi = svgMinifiTask;

/* ----- webp ----- */
const webpTask = () => {
	return gulp
		.src( devImgFile )
		.pipe( webp() )
		.pipe( gulp.dest( projectImg ) );
}
exports.webp = webpTask;



exports.img = gulp.series(
	gulp.parallel( imgMinifiTask , imgSvgMinifiTask , svgMinifiTask , webpTask )
);




///////////////////////////////////////////////////////////////
// javascriptMin
///////////////////////////////////////////////////////////////
/* ----- basic ----- */
const jsBasicTask = () => {
	return gulp
		.src([
			devScript + '**.js',
			'!' + devHtml + '**/_*.js',
		])
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( uglify({ output: {comments: 'some'} }) )
		.pipe( rename({extname: '.min.js'}) )
		.pipe( gulp.dest( projectJs ));
}

/* ----- library ----- */
const jsLibraryTask = () => {
	return gulp
		.src( devScript + 'library/*.js' )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( concat('library.js') )
		.pipe( gulp.dest( projectJs ));
}

/* ----- module ----- */
const jsModuleTask = () => {
	return gulp
		.src( devScript + 'module/*.js' )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( concat('module.js') )
		.pipe( uglify({ output: {comments: 'some'} }) )
		.pipe( rename({extname: '.min.js'}) )
		.pipe( gulp.dest( projectJs ));
}

exports.js = gulp.series(
	gulp.parallel( jsBasicTask , jsLibraryTask , jsModuleTask )
);





///////////////////////////////////////////////////////////////
// move
///////////////////////////////////////////////////////////////
const devMove = [ devHtml + '**/*.+(mp4|mp3|mov|m4a|txt|pdf|ttf|eot|woff|woff2|ico|webp)', devHtml + '**/apng*.+(png)' ];

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
		+ "\n" + '   @task    : pug,sass,wp_css,js,img,move'
		+ "\n" + '   @version : 2.0.0'
		+ "\n" + '   @gulp    : 4.0.2'
		+ "\n" + '   @node    : 14.14.0'
		+ "\n"
		+ "\n" + '   Copyright (C) 2020 Taichi Matsutaka'
		+ "\n"
		+ "\n" + '------------------------------------------------- Now Watching --'
		+ "\n"
	);

	gulp.watch( devRoot + '**/*.pug' , gulp.parallel( pugTask ) );
	gulp.watch( devSass + '**/*.scss' , gulp.parallel( sassTask ) );
	gulp.watch( devWpCssFile , gulp.parallel( wpCssTask ) );
	gulp.watch( devScript + '**/*.js' , gulp.parallel( jsBasicTask , jsLibraryTask , jsModuleTask ) );
	gulp.watch( devImgFile , gulp.parallel( imgMinifiTask ) );
	gulp.watch( devImgSvgFile , gulp.parallel( imgSvgMinifiTask ) );
	gulp.watch( devSvgFile , gulp.parallel( svgMinifiTask ) );
	gulp.watch( devImgFile , gulp.parallel( webpTask ) );
	gulp.watch( devMove , gulp.parallel( moveTask ) );
}
exports.watch = watchTask;



///////////////////////////////////////////////////////////////
// default
///////////////////////////////////////////////////////////////
exports.default = gulp.series(
	gulp.series(
		pugTask,
		sassTask,
		wpCssTask,
		jsBasicTask,
		jsLibraryTask,
		jsModuleTask,
		imgMinifiTask,
		imgSvgMinifiTask,
		webpTask,
		svgMinifiTask,
		moveTask,
		watchTask,
	)
);





