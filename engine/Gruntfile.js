module.exports = function(grunt) {

    var sourceFiles = grunt.file.readJSON("sourceFiles.json");

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            main: {
                files: [
                    // includes files within path
                    {expand: true, cwd: '../public/', src: ['**'], dest: '../../../../../Sites/BrowserGame/public/', filter: 'isFile'}
                ]
            }
        },

        concat: {
            dist: {
                src: sourceFiles,
                dest: "../public/js/libs/opus.js"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['concat', 'copy']);
};