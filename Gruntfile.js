module.exports = function(grunt) {

  grunt.initConfig({
    pkg: { name: 'millercolumns' },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['modules/column/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['gruntfile.js', 'modules/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    compass: {
        dist: {
            options: {
                sassDir: 'sass/sass',
                cssDir: 'sass/css'
            }
        }
    },
    watch: {
        compass: {
            files: ['sass/**/*.scss'],
            tasks: ['compass']
        },
        concat: {
            files: ['modules/column/*.js'],
            tasks: ['concat', 'uglify']
        }
    }
    
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.registerTask('default', ['concat', 'uglify', 'watch']);

};
