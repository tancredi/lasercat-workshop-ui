var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    color = require('cli-color'),
    nib = require('nib'),
    griddy = require('griddy');

// Paths configuration

var paths = {
    styles: {
        watch: 'stylus/**/*.styl',
        src: 'stylus/main.styl',
        out: 'css'
    }
};

// Beep function for error handling

function beep () {
    console.log('\007');
}

// Custom handler for compiling errors

function handleError (error) {
    beep(error);
    console.log(color.bold('[ Error:\n') + color.red(error) + color.bold(' ]'));
}

// Compile Stylus into CSS

gulp.task('styles', function () {
    gulp.src(paths.styles.src)
    .pipe(stylus({
        pretty: true,
        use: [ nib(), griddy() ]
    }))
    .on('error', handleError)
    .pipe(gulp.dest(paths.styles.out));
});

// Build the codebase

gulp.task('build', [ 'styles' ]);

// Watch the codebase for changes

gulp.task('watch', [ 'build' ], function () {
    gulp.watch(paths.styles.watch, [ 'styles' ]);
});

// Default task set to build

gulp.task('default', [ 'build' ]);