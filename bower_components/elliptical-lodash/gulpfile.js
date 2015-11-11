var gulp=require('gulp'),
    fs = require('fs-extra'),
    concat=require('gulp-concat'),
    uglify = require('gulp-uglify'),
    REPO_NAME='elliptical lodash custom builds',
    DIST='./dist';


gulp.task('default',function(){
    console.log(REPO_NAME + ' ..."tasks: gulp build|minify"');
});

gulp.task('build',function(){
    concatFileStream('./lib/function.js','./dist','elliptical.lodash.function.js');
    concatFileStream('./lib/collections.js','./dist','elliptical.lodash.collections.js');
});

gulp.task('minify',function(){
    minFileStream('./lib/function.js','./dist','elliptical.lodash.function.min.js');
    minFileStream('./lib/collections.js','./dist','elliptical.lodash.collections.min.js');
});

function srcStream(src){
    if(src===undefined) src=BUILD_JSON;
    return gulp.src(src);
}

function concatStream(name,src){
    if(src===undefined) src=BUILD_JSON;
    return srcStream(src)
        .pipe(concat(name))
}

function fileStream(src,dest){
    gulp.src(src)
        .pipe(gulp.dest(dest));
}

function concatFileStream(src,dest,name){
    gulp.src(src)
        .pipe(concat(name))
        .pipe(gulp.dest(dest));
}

function minFileStream(src,dest,name){
    gulp.src(src)
        .pipe(concat(name))
        .pipe(uglify())
        .pipe(gulp.dest(dest));
}