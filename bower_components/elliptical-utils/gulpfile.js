var gulp=require('gulp'),
    concat=require('gulp-concat'),
    uglify = require('gulp-uglify'),
    BUILD_JSON=require('./build/dist.json'),
    BUILD_NAME='elliptical.utils.js',
    MIN_NAME='elliptical.utils.min.js',
    REPO_NAME='elliptical utils',
    DIST='./dist';


gulp.task('default',function(){
    console.log(REPO_NAME + ' ..."tasks: gulp build|gulp minify"');
});

gulp.task('build',function(){
       concatStream(BUILD_NAME)
           .pipe(gulp.dest(DIST));
});

gulp.task('minify',function(){
       concatStream(MIN_NAME)
        .pipe(uglify())
        .pipe(gulp.dest(DIST));
});

function srcStream(){
    return gulp.src(BUILD_JSON);
}

function concatStream(name){
    return srcStream()
        .pipe(concat(name))
}
