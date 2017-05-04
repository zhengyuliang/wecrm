/*!
 * cc融合项目gulp构建文件
 * 
 * @Author:zhengyuliang
 * @Data: 2017/05/02
 * @Time: 09:14
 */

var gulp = require('gulp'), //必须选引入gulp插件
	del = require('del'), //文件删除
	sass = require('gulp-sass'), //sass编译
	cached = require('gulp-cached'), //缓存当前任务中的文件，只让已修改的文件通过管道
	uglify = require('gulp-uglify'), //js压缩
	rename = require('gulp-rename'), //重命名
	concat = require('gulp-concat'), //合拼文件
	notify = require('gulp-notify'), //相当于console.log()
	header = require('gulp-header'), //
	filter = require('gulp-filter'), //过滤筛选指定文件
	jshint = require('gulp-jshint'), //js语法校验
	rev = require('gulp-rev-append'), //插入文件指纹（MD5）
	cssnano = require('gulp-cssnano'), //css压缩
	imagemin = require('gulp-imagemin'), //图片优化
	browserSync = require('browser-sync'), //保存自动刷新
	fileinclude = require('gulp-file-include'), //可以include html文件
	autoprefixer = require('gulp-autoprefixer'), //添加css浏览器前缀
	sourcemaps = require('gulp-run-sequence'); //顺序

// var dist = 'dist/';
var pkg = require('./package.json'); //版本管理内容


gulp.task('sass',function() {
	return gulp.src(['src/sass/cc/*.scss'])
		.pipe(sass({outpuStyle: 'expended'})) //编译 sass 并设置输出格式
		.pipe(autoprefixer('last 5 version')) //添加 CSS 浏览器前缀，兼容最新的5个版本
		.pipe(cssnano({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(concat("app.css"))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/style/css'));
});

// copy 复制情态内容
gulp.task('copy', function() {
	return gulp.src(['src/lib/**/*','src/fonts/**/*'],{ base: 'src' })
		.pipe(gulp.dest('dist/style'))
});

// html
gulp.task('html',function() {
	return gulp.src(['src/*.html','src/templates/*.html','!src/templates/common'],{ base: 'src' })
		.pipe(gulp.dest('dist'))
})

// 合拼js
gulp.task('script',function() {
	return gulp.src(['src/js/**/*.js','!src/js/**/*.min.js','!src/js/controller/**/*.*'])
		// .pipe(cached('script'))
		// .pipe(rename({suffix:'.min'}))
		//.pipe(uglify())
		.pipe(concat('app_js.js'))
		.pipe(gulp.dest('dist/style/js'))
})

//image
gulp.task('image',function() {
	return gulp.src('src/img/**/*.{jpg,jpeg,png,gif}')
		.pipe(cached('image'))
		.pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true, multipass: true})) // 取值范围：0-7（优化等级）,是否无损压缩jpg图片，是否隔行扫描gif进行渲染，是否多次优化svg直到完全优化
		.pipe(gulp.dest('dist/style/img'));
});

// data 数据内容
gulp.task('data',function() {
	return gulp.src('src/data/**/*.js')
		.pipe(gulp.dest('dist/data'))
})

// clean 清空 dist 目录
gulp.task('clean', function() {
 	return del('dist/**/*');
});

gulp.task('jspublic', function(){
    return gulp.src(['src/js/controller/**/*.js'])
        // .pipe(cached('script'))
        .pipe(rename({suffix: '.min'}))
        //.pipe(uglify())
		.pipe(concat('controller_js.js'))
		.pipe(gulp.dest('dist/style/js'))
});

// styleReload （结合 watch 任务，无刷新CSS注入）
gulp.task('styleReload', ['sass'], function() {
  return gulp.src(['dist/style/css/**/*.css'])
    .pipe(browserSync.reload({stream: true})); // 使用无刷新 browserSync 注入 CSS
});

//build 需要插入资源指纹（MD5），html 最后执行
gulp.task('build', ['sass', 'script','jspublic','image','copy','data'], function () {
 	gulp.start('html');
});

// default 默认任务，依赖清空任务
gulp.task('default', ['clean'], function() {
	gulp.start('build');
});

gulp.task('watch',function() {
    browserSync.init({
        server: {
            baseDir: 'dist' // 在 dist 目录下启动本地服务器环境，自动启动默认浏览器
        },
        port: 3004 //端口修改（如本地端口被占用，请自行修改此端口）
    });

    // 监控 SASS 文件，有变动则执行CSS注入
    gulp.watch('src/sass/**/*.scss', ['styleReload']);

    // 监控 js 文件，有变动则执行 script 任务
    gulp.watch(['src/js/**/*.js','!src/js/**/*.min.js','!src/js/controller'], ['script']);
    gulp.watch(['src/js/controller/**/*.js'], ['jspublic']);

    // 监控图片文件，有变动则执行 image 任务
    gulp.watch('src/img/**/*', ['image']);

    // 监控data文件，有变动则执行 data 任务
    gulp.watch('src/data/**/*', ['data']);

    gulp.watch(['src/lib/**/*','src/fonts/*'], ['copy'])

    // 监控 html 文件，有变动则执行 html 任务
    gulp.watch('src/**/*.html', ['html']);
    // 监控 dist 目录下除 css 目录以外的变动（如js，图片等），则自动刷新页面
    gulp.watch(['dist/**/*', '!dist/style/css/**/*']).on('change', browserSync.reload);
})