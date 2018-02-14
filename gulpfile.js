const gulp = require('gulp');
const del = require('del');
const awspublish = require('gulp-awspublish');
const rename = require('gulp-rename');
const awsCredential = require('./aws-credential.js');
const s3BucketConfig = require('./aws-s3-bucket-config.js');
const s3BucketConfigWithCredential = Object.assign({}, awsCredential, s3BucketConfig);
const publisher = awspublish.create(s3BucketConfigWithCredential);
const headers = {'Cache-Control': 'public, must-revalidate, proxy-revalidate, max-age=0'};

gulp.task('clean', () =>{
    return del(['dist']);
})
;

gulp.task('zipcode_build',['createDataDirectory', 'createJsDirectory'], () => {
    gulp.start('s3replaceAndUploadData');
})
;

gulp.task('createBuildDirectory', () => {
    return gulp.src('data/*.js')
        .pipe(gulp.dest('dist/data'));
})
;

gulp.task('createJsDirectory', () => {
    return gulp.src('script/*.js')
        .pipe(gulp.dest('dist/script'));
})
;

gulp.task('s3replaceAndUploadData', ['s3replaceAndUploadJs'], function(){
    gulp.src(['dist/data/*.js'])
        .pipe(rename(function (path) {
            path.dirname += '/data';
        }))
        .pipe(publisher.publish(headers))
        .pipe(awspublish.reporter({
            states: ['create', 'update', 'delete']
        }));
});

gulp.task('s3replaceAndUploadJs', function(){
    gulp.src(['dist/script/*.js'])
        .pipe(rename(function (path) {
            path.dirname += '/script';
        }))
        .pipe(publisher.publish(headers))
        .pipe(awspublish.reporter({
            states: ['create', 'update', 'delete']
        }));
});
