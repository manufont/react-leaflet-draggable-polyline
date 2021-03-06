var gulp = require('gulp');
var initGulpTasks = require('react-component-gulp-tasks');

/**
 * Tasks are added by the react-component-gulp-tasks package
 *
 * See https://github.com/JedWatson/react-component-gulp-tasks
 * for documentation.
 *
 * You can also add your own additional gulp tasks if you like.
 */

var taskConfig = {

	component: {
		name: 'DraggablePolyline',
		dependencies: [
			'classnames',
			'react',
			'react-dom',
			'leaflet',
			'react-leaflet'
		],
		lib: 'lib'
	},

	example: {
		src: 'example/src',
		dist: 'example/dist',
		files: [
			'index.html',
			'reordered.html',
			'directions.html',
			'.gitignore'
		],
		scripts: [
			'basic.js',
			'reordered.js',
			'directions.js'
		],
		less: [
			'example.less'
		]
	}

};

initGulpTasks(gulp, taskConfig);
