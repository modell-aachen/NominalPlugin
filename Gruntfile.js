module.exports = function(grunt) {
  require('time-grunt')(grunt);

  var target = grunt.option('target') || 'dev';
  var foswikiBase = grunt.option('foswiki') || '/opt/qwiki';
  var checkoutBase = grunt.option('git') || '/opt/git';

  var pkg = grunt.file.readJSON('package.json');
  var isPlugin = /Plugin$/.test( pkg.name );
  pkg.pubDir = 'pub/System/' + pkg.name;
  pkg.dataDir = 'data';
  pkg.localeDir = 'locale';
  pkg.libDirBase = 'lib/Foswiki/' + (isPlugin ? 'Plugins/': 'Contrib/');
  pkg.libDir = pkg.libDirBase + pkg.name;
  pkg.node = 'node_modules';

  grunt.initConfig({
    pkg: pkg,

    clean: {
      css: ["<%= pkg.pubDir %>/css/nominal.*css"],
      js: [
              "<%= pkg.pubDir %>/js/excanvas.*js",
              "<%= pkg.pubDir %>/js/nominal.*js"
      ],
      manifest: ["manifest.tmp"]
    },

    copy: {
      manifest: {
        files: [
          {
            src: ['manifest.tmp'],
            dest: '<%= pkg.libDir %>/MANIFEST',
            mode: 0644
          }
        ]
      }
    },

    exec: {
      install: {
        cmd: function() {
          var cmd = [
            'cd ' + foswikiBase,
            './pseudo-install.pl ' + pkg.name
          ];

          return cmd.join( '&&' );
        }
      }
    },

    'file-creator': {
      options: {
        openFlags: 'w'
      },
      'create-manifest-tmp': {
        'manifest.tmp': function( fs, handle, done ) {
          var glob = grunt.file.glob;
          var _ = grunt.util._;

          var ignore = [
            'node_modules/',
            'Gruntfile.js',
            'src/',
            '.git/',
            '.gitignore',
            '.cache/',
            'build.pl',
            'README.md',
            'MANIFEST',
            'package.json',
            'manifest.tmp'
          ];

          glob( '**/*', function ( err, files ) {
            var entries = [];
            _.each( files, function( file ) {
              for ( var i = 0; i < ignore.length; ++i ) {
                if ( file.indexOf( ignore[i] ) > -1 )
                  return;

                if ( grunt.file.isDir( file ) )
                  return;
              }

              entries.push( file );
            });

            entries.push( '' );
            fs.writeSync( handle, entries.join( ' 0644\n' ) );
            done();
          });
        }
      }
    },

    sass: {
      options: {
          includePaths: ['<%= pkg.pubDir %>/src/scss/']
      },
      dev: {
        options: {
          outputStyle: 'nested',
        },
        files: {
          '<%= pkg.pubDir %>/css/nominal.css': '<%= pkg.pubDir %>/src/scss/nominal.scss',
        }
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          '<%= pkg.pubDir %>/css/nominal.min.css': '<%= pkg.pubDir %>/src/scss/nominal.scss',
        }
      }
    },

    todo: {
      options: {
        marks: [
          {
            name: 'tbd',
            pattern: /tbd/i,
            color: "orange"
          },{
            name: 'fixme',
            pattern: /fixme/i,
            color: "red"
          },
          {
            name: "todo",
            pattern: /todo/i,
            color: "yellow"
          }
        ],
      },
      src: [
        '<%= pkg.pubDir %>/src/**/*',
        '<%= pkg.libDirBase %>/**/*.pm',
        '<%= pkg.dataDir %>/**/*.txt',
        '<%= pkg.localeDir %>/**/*.po'
      ]
    },

    uglify: {
      dev: {
        options: {
          beautify: false,
          mangle: false,
          preserveComments: 'all'
        },
        files: {
          '<%= pkg.pubDir %>/js/nominal.js': [
            '<%= pkg.node %>/knockout/build/output/knockout-latest.debug.js',
            '<%= pkg.pubDir %>/src/js/**/!(excanvas).js'
          ],
          '<%= pkg.pubDir %>/js/excanvas.js': ['<%= pkg.pubDir %>/src/js/excanvas.js'],
        }
      },
      dist: {
        options: {
          compress: {
            warnings: false
          },
          mangle: true,
          preserveComments: false
        },
        files: {
          '<%= pkg.pubDir %>/js/nominal.min.js': [
            '<%= pkg.node %>/knockout/build/output/knockout-latest.js',
            '<%= pkg.pubDir %>/src/js/**/!(excanvas).js'
          ],
          '<%= pkg.pubDir %>/js/excanvas.min.js': ['<%= pkg.pubDir %>/src/js/excanvas.js'],
        }
      }
    },

    watch: {
      options: {
        interrupt: true,
      },
      grunt: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['<%= pkg.pubDir %>/src/scss/**/*.scss'],
        tasks: ['sass:' +  target]
      },
      uglify: {
        files: ['<%= pkg.pubDir %>/src/js/**/*.js'],
        tasks: ['uglify:' + target]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-file-creator');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-todo');

  grunt.registerTask('default', ['build', 'watch']);
  grunt.registerTask('install', ['clean', 'build', 'manifest', 'pseudo-install']);
  grunt.registerTask('prepare-manifest', ['file-creator:create-manifest-tmp']);
  grunt.registerTask('manifest', ['prepare-manifest', 'copy:manifest', 'clean:manifest']);
  grunt.registerTask('pseudo-install', ['exec:install']);
  grunt.registerTask('build', [
    'sass',
    'uglify'
  ]);
}
