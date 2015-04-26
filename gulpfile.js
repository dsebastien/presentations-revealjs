'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp-help')(require('gulp')); // note that gulp-help is loaded first: https://www.npmjs.com/package/gulp-help/
var $ = require('gulp-load-plugins')(); // https://www.npmjs.com/package/gulp-load-plugins
var runSequence = require('run-sequence');
var del = require('del');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var fs = require('fs');

var markdown = require('./node_modules/reveal.js/plugin/markdown/markdown.js');

// Config
var tempFolder = './.tmp';
var templateFolder = './template';
var templateFile = templateFolder + '/index.html';
var presentationFolder = './presentation';
var mainSlidesFile = presentationFolder + '/main.md';
var slideDeckFile = 'slides.md';
var presentationFile = 'slides.html';
var presentationConfigFile = presentationFolder + '/config.json';
var buildFolder = './dist';
var template = fs.readFileSync(templateFile, 'utf8');
var placeHolderPrefix='{{';
var placeHolderSuffix='}}';
var slidesPlaceHolder=placeHolderPrefix+'__slides__'+placeHolderSuffix;

var markdownPluginOptions = {
	separator: '^(\r\n?|\n)---(\r\n?|\n)$',
	notesSeparator: 'note:',
	verticalSeparator: '^(\r\n?|\n)----(\r\n?|\n)$'
};

// Utility methods

// replace all occurrences: http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
function replaceAll(search, replacement, str) {
	return str.split(search).join(replacement);
}


gulp.task('clean', 'Clean output directories', del.bind(null, ['.tmp/*', 'dist/*', '!dist/.git'], {dot: true}));

gulp.task('copy', 'Copy the template files and presentation assets', function () {
  return gulp.src([
	presentationFolder+ '/**/*',
	'!' + presentationFolder + '/*.{md,json}', // the presentation and config file are processed separately
	'!' + presentationFolder + '/assets/README.txt',
	'!' + presentationFolder + '/.editorconfig', // dotfiles are ignored
    templateFolder + '/**/*',
	'!' + templateFile // the HTML template are processed separately
  ], {
    dot: true
  })
  
  // Copy
  .pipe(gulp.dest('dist'))
  
  // Task result
  .pipe($.size({title: 'copy'}));
});

gulp.task('convert-markdown', 'Convert the markdown code to Reveal.js HTML slides', function () {
	//TODO: prepare the array to pass to gulp.src to regroup the files differently (e.g., one slide deck per file, one slide deck per group of files with the same prefix, as well as the order to respect)
	return gulp.src([
		mainSlidesFile,
		presentationFolder + '/*.md'
	])
	
	// concat all files together
	.pipe($.concat(slideDeckFile))
	
	// dump the merged markdown (useful for debugging)
	//.pipe(gulp.dest(tempFolder))
	
	// use reveal.js's markdown plugin to convert the markdown code to slides
	.pipe($.change(function(content){
		var slides = markdown.slidify(content, markdownPluginOptions);
		//console.log(slides);
		return slides;
	}))
	
	.pipe($.rename({
		extname: '.html'
	}))
	
	// Display the files in the stream
	//.pipe($.debug({title: 'Stream contents:', minimal: true}))
	
	// convert html to reveal.js slides
	// code shamelessly taken from https://github.com/bmpvieira/gulp-reveal
	// (and tweaked a bit)
	
	/*
	.pipe($.change(function(content){
		var slides = '';
		content.split('\n<hr>\n').forEach(function (slide, i) {
			var state = '';
			if (slide.match(/<h2.*\?<\/h2>/)) {
			  state = ' data-state=q';
			} else if (slide.indexOf('<h2') !== -1) {
			  state = ' data-state=title';
			}
			if (i === 0) {
			  state = ' data-state=front';
			}
			slides = slides.concat(
				'\n<section' + 
				state + 
				'>\n' + 
				slide + 
				'\n</section>\n'
			);
		});
			
		return slides;
	}))
	*/
	
	// Output files
    .pipe(gulp.dest(tempFolder))
	
	// Task result
    .pipe($.size({title: 'convert-markdown'}));
});

gulp.task('validate-config-file', 'Validate the presentation configuration file', function(){
	return gulp.src([
		presentationConfigFile
	])
	
	.pipe($.jsonlint())
	.pipe($.jsonlint.reporter());
	
});

gulp.task('watch', 'Watch the presentation for changes, automatically convert to HTML', function () {
  gulp.watch(presentationFolder + '/*.{md,json}', ['default']);
});

gulp.task('serve', 'Watch the presentation for changes, automatically convert to HTML and display the results', ['default', 'watch'], function () {
	browserSync({ // http://www.browsersync.io/docs/options/
		notify: false,
		// Run as an https by uncommenting 'https: true'
		// Note: this uses an unsigned certificate which on first access
		//       will present a certificate warning in the browser.
		// https: true,
		server: {
			baseDir: buildFolder,
			//directory: true, // enable directory listing if there are multiple presentations
			index: presentationFile
		},
		ghostMode: { // replicate actions in all clients
			clicks: false,
			forms: false,
			scroll: false
		}
	});

	gulp.watch([buildFolder + '/*.html'], reload); // html changes will force a reload
});

gulp.task('build', 'Build the presentation', ['convert-markdown', 'validate-config-file'], function () {
	var presentationConfig = require(presentationConfigFile); // the config file is loaded here in order to always take changes into account
	
	return gulp.src([
		tempFolder + '/*.html'
	])
	
	.pipe($.change(function(content){ // content represents a set of slides
		// take the template as basis
		var pageContents = "" + template;
		
		// replace all placeholders (title, description, author, ...)
		var interpolatedContent = content;
		
		for (var key in presentationConfig) {
			if (presentationConfig.hasOwnProperty(key)) { // avoid inherited properties: http://stackoverflow.com/questions/684672/loop-through-javascript-object
				//console.log(key + " -> " + presentationConfig[key]);
				var placeHolderToSearchFor = placeHolderPrefix + key + placeHolderSuffix;
				
				//console.log(placeHolderToSearchFor);
				
				// interpolation for the slides
				interpolatedContent = replaceAll(
					placeHolderToSearchFor,
					presentationConfig[key],
					interpolatedContent
				);
				
				// interpolation for the template
				pageContents = replaceAll(
					placeHolderToSearchFor,
					presentationConfig[key],
					pageContents
				);
			}
		}
		
		// inject the slides in the page
		pageContents = replaceAll(
			slidesPlaceHolder,
			interpolatedContent,
			pageContents
		);
		
		return pageContents;
	}))
    
	// Output files
    .pipe(gulp.dest(buildFolder))
	
	// Task result
    .pipe($.size({title: 'default'}));
});

gulp.task('default', 'Build production files', ['clean'], function (cb) {
	runSequence('build', ['copy'], cb);
});