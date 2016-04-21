/*global module:false*/
module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.initConfig({
	  ngdocs: {
		   options: {
		       dest: 'docs',
		       html5Mode: false,
		       scripts: [
		           '/node_modules/angular/angular.min.js',
		           '/node_modules/angular-animate/angular-animate.min.js'
		       ]
		   },
		   api: {
		       src: ['app/components/**/*.js','app/shared/**/*.js'], /* exclude files with '!' */
		       title: 'Docs'
		   }
		},
	    pkg: grunt.file.readJSON('package.json'),
	    changelog: { options: { dest: 'CHANGELOG.md' } },
	    jasmine_node: {
	      forceexit: true,
	      captureExceptions: true
	    },
	    watch: {
	      parser: {
	        files: ['src/*.js', 'spec/*Spec.js'],
	        tasks: ['jasmine_node']
	      }
	    }
  });

  grunt.registerTask('test', 'Run tests for parser code', ['jasmine_node']);

};
