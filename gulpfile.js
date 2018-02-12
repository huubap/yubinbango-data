const gulp = require('gulp');
const del = require('del');
const s3Replace = require('gulp-s3-replace');
const awsCredential = require('./aws-credential.js');
const s3BucketConfig = require('./aws-s3-bucket-config.js');
const s3BucketConfigWithCredential = Object.assign({}, awsCredential, s3BucketConfig);

gulp.task('clean', () =>{
    return del(['dist']);
})
;

gulp.task('zipcode_build',['createBuildDirectory'], () => {
    gulp.start('s3replaceAndUpload');
})
;

gulp.task('createBuildDirectory', () => {
    return gulp.src('data/*.js')
        .pipe(gulp.dest('dist'));
})
;

gulp.task('s3replaceAndUpload', function(){
    gulp.src(['data/*.js'])
        .pipe(s3Replace({
            basePath: './',
            bucketName: s3BucketConfigWithCredential.params.Bucket,
            fileExtensions: ['js'],
            s3: {
                s3Options: {
                    accessKeyId: s3BucketConfigWithCredential.accessKeyId,
                    secretAccessKey: s3BucketConfigWithCredential.secretAccessKey
                }
            }
        }));
});
