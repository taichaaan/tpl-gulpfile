/**
 * gulpfile.js
 * @creation: 200??.??.??
 * @update  : 2020.04.02
 * @version : 1.0.3
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
const concat     = require('gulp-concat'); // Combine multiple files.
const del        = require('del');
const header     = require('gulp-header'); // header comment


// Sass plugin.
const sass         = require('gulp-sass'); // Sass compile.
const autoprefixer = require('gulp-autoprefixer'); // Autoprefixer.
const bulkSass     = require('gulp-sass-bulk-import'); // Import at a stretch.
const gcmq         = require('gulp-group-css-media-queries');
const cleanCSS     = require("gulp-clean-css");

// Minify Images plugin.
const changed     = require('gulp-changed'); // Check files to be updated.
const imagemin    = require('gulp-imagemin'); // Compress image.
const imageminJpg = require('imagemin-jpeg-recompress'); // Compress jpg image.
const imageminPng = require('imagemin-pngquant'); // Compress png image.
const imageminGif = require('imagemin-gifsicle'); // Compress gif image.
const svgmin      = require('gulp-svgmin'); // Compress svg image.

// Pug min
const pug         = require('gulp-pug'); // pug
const htmlComp    = require('gulp-phtml-simple-comp'); // phtml-simple-comp
const PugBeautify = require('gulp-pug-beautify');

// Minify javaScript plugin.
const uglify = require('gulp-uglify-es').default; // Compress javascript file.








///////////////////////////////////////////////////////////////
// Pug
///////////////////////////////////////////////////////////////
gulp.task('pug', () => {
	gulp.src( [ devHtml + '**/*.pug', '!' + devHtml + '**/_*.pug', '!' + devHtml + '**/#*.pug' ] )
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
});






///////////////////////////////////////////////////////////////
// sass
///////////////////////////////////////////////////////////////
gulp.task("sass",function(){
	// .min.css
	gulp.src( devSass + '**/*.scss')
		// .pipe( sourcemaps.init() )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( bulkSass() )
		.pipe( sass({
			outputStyle: 'compressed',
			// outputStyle: 'expanded',
			// indentWidth: 1,
			// indentType : 'tab',
		}) )
		.pipe(header('@charset "UTF-8";\n\n'))
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
})




///////////////////////////////////////////////////////////////
// imageMin
///////////////////////////////////////////////////////////////

// jpg,png,gif
const priginalGlob = [devImg + '**/*.+(jpg|jpeg|png|gif)' , '!' + devHtml + '**/apng*.+(png)'  ,'!' + devImg + '**/_*.+(jpg|jpeg|png|gif)'];

gulp.task('imagemin', function(){
	gulp.src( priginalGlob )
	.pipe(changed( projectImg ))
		.pipe(imagemin([
			imageminPng(),
			imageminJpg(),
			imageminGif({
				interlaced: false,
				optimizationLevel: 3,
				colors:180
			})
		]
	))
	.pipe(gulp.dest( projectImg ));
});

const no_priginalGlob = devImg + '**/_*.+(jpg|jpeg|png|gif)';
gulp.task('image_nomin', function(){
	gulp.src( no_priginalGlob )
	.pipe(gulp.dest( projectImg ));
});



// svg
const priginalImgSvgGlob = devImg + '**/*.+(svg)';
const priginalSvgGlob = devSvg + '**/*.+(svg)';

gulp.task('svgmin', function(){
	gulp.src( priginalImgSvgGlob )
	.pipe(changed( projectImg ))
	.pipe(svgmin())
	.pipe(gulp.dest( projectImg ));
});

gulp.task('svgmin', function(){
	gulp.src( priginalSvgGlob )
	.pipe(changed( projectSvg ))
	.pipe(svgmin())
	.pipe(gulp.dest( projectSvg ));
});





///////////////////////////////////////////////////////////////
// allImageMin
///////////////////////////////////////////////////////////////
gulp.task('imgmin',
	['imagemin','svgmin','image_nomin']
);





///////////////////////////////////////////////////////////////
// javascriptMin
///////////////////////////////////////////////////////////////
gulp.task('jsmin', function() {
	// common.js
	// gulp.src([ devScript + 'module/*.js' , devScript + 'common.js' ])
	// 	.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
	// 	.pipe( concat( 'common.js' ) )
	// 	.pipe( gulp.dest( projectJs ));

	gulp.src( devScript + 'library/*.js' )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( concat('library.js') )
		.pipe( gulp.dest( projectJs ));


	gulp.src( devScript + 'module/*.js' )
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( concat('module.js') )
		.pipe( uglify() )
		.pipe( rename({extname: '.min.js'}) )
		.pipe( gulp.dest( projectJs ));

	gulp.src([
			devScript + '**.js',
			'!' + devHtml + '**/_*.js',
		])
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( uglify() )
		.pipe( rename({extname: '.min.js'}) )
		.pipe( gulp.dest( projectJs ));

});






///////////////////////////////////////////////////////////////
// move
///////////////////////////////////////////////////////////////
const devMove_file = [ devHtml + '**/*.+(txt|pdf|ttf|eot|woff|ico|webp)', devHtml + '**/apng*.+(png)' ];

gulp.task('move', function () {
	gulp.src( devMove_file )
		.pipe(changed( projectHtml ))
		.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
		.pipe( gulp.dest( projectHtml ) );
});







///////////////////////////////////////////////////////////////
// watch
///////////////////////////////////////////////////////////////
gulp.task('watch', function() {
	console.log(
		''
		+ "\n" + '-- Now Watching ------------------------------------------------'
		+ "\n"
		+ "\n" + '   @name    gulp watch'
		+ "\n" + '   @content all task'
		+ "\n"
		+ "\n" + '   Copyright (C) 2020 taichi matsutaka'
		+ "\n"
		+ "\n" + '------------------------------------------------- Now Watching --'
		+ "\n"
	)

	// pug
	gulp.watch( [devRoot + '**/*.pug'],['pug']);
	// css min
	gulp.watch( [devSass + '**/*.scss'],['sass']);
	gulp.watch( [devWp + '**/*.css'],['wp-css']);
	// js min
	gulp.watch( [devScript + '**/*.js'],['jsmin']);
	// img min
	gulp.watch( [priginalGlob],['imagemin']);
	gulp.watch( [no_priginalGlob],['image_nomin']);
	gulp.watch( [priginalImgSvgGlob],['svgmin']);
	gulp.watch( [priginalSvgGlob],['svgmin']);
	// other
	gulp.watch( [devMove_file],['move']);


});






///////////////////////////////////////////////////////////////
// default
///////////////////////////////////////////////////////////////
gulp.task('default', ['watch','pug','sass','jsmin','imagemin','image_nomin','svgmin','move']);







