// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const terser = require('gulp-terser-js');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');
const connect = require('gulp-connect'); // Runs a local webserver
const open = require('gulp-open'); // Opens a URL in a web browser
var replace = require('gulp-replace');


// File paths
const files = { 
    scssPath: 'app/scss/**/*.scss',
    jsPath: 'app/js/**/*.js',
    imgPath: 'app/images/**/*'
}

// Sass task: compiles the style.scss file into style.css
function scssTask(){    
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('dist')
    ); // put final CSS in dist folder
}

// JS task: concatenates and terser JS files to script.js
function jsTask(){
    return src([
        files.jsPath
        //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
        ])
        .pipe(concat('all.js'))
        .pipe(terser())
        .pipe(dest('dist')
    );
}

// Cachebust
function cacheBustTask(){
    var dateString = new Date().getTime();
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + dateString))
        .pipe(dest('.'));
}

//Imagemin
function imgMinifiedTask() {
    return src([
        files.imgPath
        ])
    .pipe(imagemin())
    .pipe(dest("dist/images/"));
    }

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
    watch([files.scssPath, files.jsPath, files.imgPath],
        {interval: 1000, usePolling: true}, //Makes docker work
        series(
            parallel(scssTask, jsTask, imgMinifiedTask),
            cacheBustTask
        )
    );    
}

// Launch Chrome web browser
// https://www.npmjs.com/package/gulp-open
function openBrowser(done) {
    var options = {
    uri: 'http://localhost:8080'
    };
    return src('./')
    .pipe(open(options));
    done();
}

// Gulp plugin to run a webserver (with LiveReload)
// https://www.npmjs.com/package/gulp-connect
function server(done) {
    return connect.server({
    root: './',
    port: 8080,
    debug: true,
    });
    done();
}



// Deploy command
exports.deploy = series( parallel(scssTask, jsTask, imgMinifiedTask));



exports.default = series(
    parallel(scssTask, jsTask, imgMinifiedTask), 
    openBrowser, 
    server,
    cacheBustTask,
    watchTasks
);