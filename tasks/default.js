/**
 * Example task file
 */

const {series} = require('gulp');

module.exports = series('example1', 'example2');
