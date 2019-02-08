module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> - Burgerverse Industries */\n',
        mangle: false
      },
      build: {
        src: ['assets/js/plugins.js','assets/js/base.js'],
        dest: 'assets/js/base.min.js'
      }
    },

    cssmin: {

      minify: {
        expand: true,
        cwd: 'assets/stylesheets/',
        src: ['*.css', '!*.min.css'],
        dest: 'assets/stylesheets/',
        ext: '.min.css'
      },

      // combine: {
      //   files: {
      //     'assets/stylesheets/combined.css': ['assets/stylesheets/screen.min.css']
      //   }
      // },

      add_banner: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> - Burgerverse Industries */\n'
        },
        files: 'assets/stylesheets/combined.css'
      }

    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'cssmin']);


};