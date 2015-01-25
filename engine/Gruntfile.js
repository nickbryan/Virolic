module.exports = function(grunt) {

    var sourceFiles = grunt.file.readJSON("sourceFiles.json");

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: sourceFiles,
                dest: "../public/js/libs/opus.js"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat']);
};