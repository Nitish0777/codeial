const gulp = require("gulp");

const sass = require("gulp-sass")(require("sass"));//for compress inside it
const cssnano = require("gulp-cssnano");
const rev = require("gulp-rev");

const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const del = require("del");
//now gulp create task which we are run
//1 minify the css

//this minification has Done...
/* any folder inside it mean(**)  */
gulp.task("css", function (done) {
	console.log("minifying css..");
	gulp
		.src("./assets/sass/**/*.scss")
		.pipe(sass())
		.pipe(cssnano())
		.pipe(gulp.dest("./assets.css"));

	return gulp
		.src("./assets/**/*.css")
		.pipe(rev())
		.pipe(gulp.dest("./public/assets"))
		.pipe(
			rev.manifest({
				cwd: "public",
				merge: true,
			})
		)
		.pipe(gulp.dest("./public/assets"));
	done();
});

//do it for the javascript
gulp.task("js", function (done) {
	console.log("minifying js..");
	gulp
		.src("./assets/**/*.js")
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest("./public/assets"))
		.pipe(
			rev.manifest({
				cwd: "public",
				merge: true,
			})
		)
		.pipe(gulp.dest("./public/assets"));
	done();
});

//this one is for the images
gulp.task("images", function (done) {
	console.log(" compressing the image...");
	gulp
		.src("./assets/**/*.+(png|jpg|gif|svg|jpeg)")
		.pipe(imagemin())
		.pipe(rev())
		.pipe(gulp.dest("./public/assets"))
		.pipe(
			rev.manifest({
				cwd: "public",
				merge: true,
			})
		)
		.pipe(gulp.dest("./public/assets"));
	done();
});

//empty the public/assets directory build it from scratch
gulp.task("clean:assets", function (done) {
	del.sync("./public/assets");
	done();
});

gulp.task(
	"build",
	gulp.series("clean:assets", "css", "images", "js"),
	function (done) {
		console.log("Building the assets...");
		done();
	}
);
