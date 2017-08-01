
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-noflo-browser');

  grunt.initConfig({
    noflo_browser: {
      options: {
        debug: true, // installs noflo-runtime-webrtc
      },
      build: {
        files: {
          'public/basic3d/js/noflo.js': ['package.json'],
        },
      }
    },
  });

  grunt.registerTask('default', ['noflo_browser']);
}
