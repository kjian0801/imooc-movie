module.exports = function(grunt) {

	grunt.initConfig({
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				// tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			uglify: {
        files: ['public/**/*.js'],
        // tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      styles: {
        files: ['public/**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				ignores: ['public/libs/**/*.js']
			},
			all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
		},
		less: {
			development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          'public/build/index.css': 'public/less/index.less'
        }
      }
		},
		uglify: {
      development: {
        files: {
          'public/build/admin.min.js': 'public/js/admin.js',
          'public/build/detail.min.js': 'public/js/details.js'
          
        }
      }
    },
		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['readme.txt', 'README.md', 'node_modules/**', '.DS_Store'],
					watchedExtensions: ['js'],
					watchedFolers: ['app', 'config'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},
		mochaTest: {
			options: {
				reporter: 'spec'
			},
			src: ['test/**/*.js']
		},
		concurrent: {
			tasks: ['nodemon', 'watch', 'less', 'uglify'],
			options: {
				logConcurrentOutput: true
			}
		}
	})


	// 监听所有文件的修改，监听修改执行注册好的任务
	grunt.loadNpmTasks('grunt-contrib-watch') 
	
	// 实时监听入口文件 app.js 自动重启服务
	grunt.loadNpmTasks('grunt-nodemon')
	// 慢任务开发插件，sass，less 等优化构建时间
	grunt.loadNpmTasks('grunt-concurrent')
	// 单元测试
	grunt.loadNpmTasks('grunt-mocha-test')

	// jshint less uglify
	grunt.loadNpmTasks('grunt-contrib-jshint')
	grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-uglify')


	grunt.option('force', true) // 忽略语法警告
	grunt.registerTask('default', ['concurrent'])
	grunt.registerTask('test', ['mochaTest'])

}