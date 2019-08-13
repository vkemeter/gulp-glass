'use strict';

const {series} = require('gulp');

module.exports = series('test1','test2');