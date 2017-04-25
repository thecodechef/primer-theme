'use-strict';

const gulp = require('gulp');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const data = require('gulp-data');
const path = require('path');
const flatmap = require('gulp-flatmap');
const _ = require('lodash');
const common = require('./src/themes/_data/commons.json');

var paths = {
    pug: {
        src: './src/themes/*.pug',
        data: './src/themes/_data/specific/*.json',
        dest: './themes'
    }
};

gulp.task('create-themes', () => {
    return gulp.src(paths.pug.data)
        .pipe(flatmap((stream, file) => {
            var basename = path.basename(file.path, path.extname(file.path));
            return gulp.src(paths.pug.src)
                .pipe(data(() => {
                    var specific = require(file.path);
                    return _.merge(common, specific);
                }))
                .pipe(pug({ pretty: true }))
                .pipe(rename((theme) => {
                    theme.basename = basename,
                        theme.extname = '.tmTheme'
                }))
                .pipe(gulp.dest(paths.pug.dest));
        }))
})

gulp.task('watch', ['create-theme'], () => {
    gulp.watch([paths.pug.src, paths.pug.data], ['create-themes'])
})

gulp.task('default', ['create-themes'], () => {});