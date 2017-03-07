'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      js: {
        files: ['gruntfile.js', 'application.js', 'lib/**/*.js', 'test/**/*.js'],
        options: {
          livereload: {
            port: 35732
          }
        }
      }
    },
    nodemon: {
      dev: {
        script: 'application.js',
        options: {
          args: [],
          ignore: ['public/**'],
          ext: 'js,html',
          nodeArgs: [],
          delayTime: 1,
          env: {
            PORT: 3000,
            NODE_ENV: 'development'
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      serve: ['nodemon', 'watch'],
      debug: ['node-inspector', 'shell:debug', 'open:debug'],
      options: {
        logConcurrentOutput: true
      }
    },
    env: {
      options: {},
      // environment variables - see https://github.com/jsoverson/grunt-env for more information
      local: {
        FH_USE_LOCAL_DB: true,
        FH_PORT: 8002,
        FH_MONGODB_CONN_URL: 'mongodb://localhost:27017/raincatcher-demo-auth-session-store',
        FH_SERVICE_MAP: function() {
          /*
           * Define the mappings for your services here - for local development.
           * You must provide a mapping for each service you wish to access
           * This can be a mapping to a locally running instance of the service (for local development)
           * or a remote instance.
           */
          var serviceMap = {
            'SERVICE_GUID_1': 'http://127.0.0.1:8010',
            'SERVICE_GUID_2': 'https://host-and-path-to-service'
          };
          return JSON.stringify(serviceMap);
        }
      }
    },
    'node-inspector': {
      dev: {}
    },
    mochaTest: {
      test: {
        options: {
          run: true
        },
        src: ['test/unit/*.js', 'lib/**/*spec.js']
      }
    },
    shell: {
      debug: {
        options: {
          stdout: true
        },
        command: 'env NODE_PATH=. NODE_ENV=development node --debug-brk application.js'
      }
    },
    open: {
      debug: {
        path: 'http://127.0.0.1:8080/debug?port=5858',
        app: 'Google Chrome'
      }
    },
    eslint: {
      src: ['*.js', 'lib/**/*.js', 'test/**/*.js']
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies'
  });
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.registerTask('unit', ['eslint','mochaTest']);
  grunt.registerTask('serve', ['env:local', 'concurrent:serve']);
  grunt.registerTask('debug', ['env:local', 'concurrent:debug']);
  grunt.registerTask('default', ['serve']);
};
