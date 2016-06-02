/*global module:false*/
module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-ngdocs');

  grunt.initConfig({
	  ngdocs: {
		   options: {
		       dest: '../documentation',
		       html5Mode: false,
		       scripts: [
		           'node_modules/angular/angular.min.js',
		           'node_modules/angular-animate/angular-animate.min.js'
		       ]
		   },
		   api: {
		       src: ['app/**/*.js','app/shared/**/*.js'], /* exclude files with '!' */
		       title: 'Docs'
		   }
		},
	    pkg: grunt.file.readJSON('package.json'),
	    changelog: { options: { dest: 'CHANGELOG.md' } }
  });

  grunt.registerTask('test', 'Run tests for parser code', ['jasmine_node']);

};
