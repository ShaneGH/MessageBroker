module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
      execute: {
        typescript: {
          src: ['node_modules/typescript/lib/tsc.js'],
          options: {
            args: ['--target', 'ES5']
          }
        }
      }
  });

  // load all plugins needed by initConfig
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', ["execute:typescript"]);
  grunt.registerTask('default', 'build');

  return;
};
