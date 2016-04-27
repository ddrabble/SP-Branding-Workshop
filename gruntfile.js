module.exports = function(grunt) {
	//a list of all JS source to pull into header
	var headerSrc = [
	  //Modernizr enables HTML5 elements & feature detects for optimal performance.
	  //Include html5shiv 3.6. Our version is a custom build.
	  //Create your own custom Modernizr build: www.modernizr.com/download/
	  'app/scripts/libs/Modernizr/modernizr-2.6.2.custom.js',
	  'app/scripts/libs/jQuery/jquery-1.11.0.js',
	  'app/scripts/libs/jQuery/jquery-migrate-1.2.1.min.js',
	  'app/scripts/libs/jQuery/jquery-ui-1.8.9.custom.min.js',
	  'app/src/bootstrap-4.0.0-alpha.2/js/dist/util.js',
	  'app/src/bootstrap-4.0.0-alpha.2/js/dist/collapse.js'
	];
	var footerSrc = [
	  'app/scripts/custom/main.js'
	];
	var pnpResponsiveSrc = [
	  'app/scripts/custom/PnP-Responsive-UI.js'
	];

	//we need a single array of JS files we will monitor based on the arrays found in jsSource.json
	var jsSrc = [];
	var jsArray = [];
	jsSrc[0] = headerSrc;
	jsSrc[1] = footerSrc;
	jsSrc[2] = pnpResponsiveSrc;
	for(var i in jsSrc)
	{
		var thisArray = jsSrc[i];
		for (j = 0; j < thisArray.length; ++j) {
			jsArray.push(thisArray[j]);
		}
	}
	//end setup

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		sass: { // SASS / CSS processing
			dist: {
				options: {						// Target options
					style: 'nested',			// nested, compact, compressed, expanded
					quiet: false,
					sourcemap: 'inline',			//none, inline, auto, file
					loadPath:["app/styles","app/src/bootstrap-4.0.0.alpha.2/scss","bower_components/bootstrap-sass/assets/stylesheets"]
				},
				files: {
					//output file on left and input file on right
					'.tmp/styles/styles.css':['app/styles/bootstrap-styles.scss'],
					'.tmp/styles/styles-susy.css':['app/styles/susy-styles.scss'],
					'.tmp/styles/pnp_responsive_ui_custom.css':['app/styles/pnp-responsive-custom.scss'],
					'.tmp/styles/yeoman-styles.css':['app/styles/yeoman-styles.scss']
				}
			}
		},

		uglify: { // JS combine and compress
			options: {
				compress: false,
				beautify: true,
				mangle: false
			},
			footer: { //footer.js
				options: {
					compress: false,
					beautify: true,
					mangle: false
				},
				src: footerSrc,
				dest: '.tmp/scripts/footer.js'
			},
			header: { //header.js
				options: {
					compress: false,
					beautify: true,
					mangle: false
				},
				src: headerSrc,
				dest: '.tmp/scripts/header.js'
			},
			pnpResponsive: { //PnP-Responsive-UI.js
				options: {
					compress: false,
					beautify: true,
					mangle: false
				},
				src: pnpResponsiveSrc,
				dest: '.tmp/scripts/PnP-Responsive-UI-custom.js'
			},
		},

		watch: { //files and folders to watch
			jsSource: { //header.js, footer.js and PnP-Responsive-UI.js
				files: jsArray,
				tasks: ['uglify'],
			},

			css: { //style.css
				files: ['app/styles/**/*.scss'],
				tasks: ['sass'],
			}
		},

		browserSync: {
			bsFiles: {
			    src : [
			    	'.tmp/styles/*.css',
			    	'.tmp/scripts/*.js',
			    	'.tmp/*.html'
			    ]
			},
			options: {
				notify: false,
				ui: false,
				watchTask: true,
			    server: {
			        baseDir: ['.tmp', 'app'],
			        index: "index.html",
			        routes: {
				        '/bower_components': 'bower_components'
				    }
			    },
			    https: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks("grunt-jscs");	
	grunt.loadNpmTasks('grunt-browser-sync');

	// Default task(s).
	grunt.registerTask('default', ['uglify','sass','browserSync','watch']);
};