#!/usr/bin/env node

'use strict';
var program = require('commander');
var jslint = require('jslint');
var LintStream = jslint.LintStream;
var utils = require('npm-utils-kingwell');
var assert = require('assert');
var minimatch = require('minimatch');
var warn = utils.warn;
var info = utils.info;
var success = utils.success;
var error = utils.error;
var log = utils.log;

warn('Beyond your imagination');

/**
 * get file name
 * @return {Array} return files
 */

function getFileName(cwd, all) {
	var fs = require('fs');
	var result = [];
	var get = function(dir) {

		var files = fs.readdirSync(dir);
		files.forEach(function(file) {
			var path = dir + '\\' + file;

			if (fs.existsSync(path)) {
				var stat = fs.statSync(path);
				if (stat.isFile()) {
					result.push(path.replace(cwd + '\\', ''));
				} else if (stat.isDirectory()) {
					if (all === true) {
						get(path);
					} else {
						result.push(path);
					}
				}
			}
		});
	};
	get(cwd);
	return result;
}

function Time(options) {
	var ops = options || {};
	this.showResult = ops.showResult === false ? false : true;
	for (var key in ops) {
		this[key] = ops[key];
	}
}
Time.prototype = {
	constructor: Time,
	showResult: true,
	log: function(msg) {
		console.log(msg);
	},
	time: function(id) {
		this[id + 'startTime'] = (new Date()).getTime();
	},
	timeEnd: function(id) {
		var result = '';
		this[id + 'endTime'] = (new Date()).getTime();
		result = this[id + 'endTime'] - this[id + 'startTime'];
		if (this.showResult) {
			this.log((id ? (id + ':') : '') + result + 'ms');
		}
		return result;
	}
};

program
	.version('0.0.1'); //声明byi的版本号

program
	.command('list')
	.description('list files')
	.option('-a,--all', 'whether to display hidden files')
	.action(function(options) {
		info('正在查找文件...');
		var time = new Time({
			log: function(msg) {

				success(msg);
			}
		});
		time.time('Search file');
		var fs = require('fs');
		var type = typeof options === 'string' ? options.slice(5, options.length) : '';
		var list = getFileName(process.cwd(), !options.all);
		var result = [];
		console.log(type);
		// fs.readdir(process.cwd(), function(err, files) {
		// 	var list = files;
		// 	if (!options.all) {
		// 		list = files.filter(function(file) {
		// 			return file.indexOf('.') !== 0;
		// 		});
		// 	}
		// 	info(list.length);
		// 	success(list.join('\n'));

		// });
		//success(list.join('\n'));
		//console.log(options);
		list.forEach(function(item) {

			if (type && minimatch(item, type)) {
				result.push(item);
			} else {
				result.push(item);
			}

		});
		//success(result.join('\n'));
		time.timeEnd('Search file');
		info('查找结束');
	});
program.parse(process.argv);