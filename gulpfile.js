'use strict';
const {basename} = require('path');

const Glass = require('./Glass');
const glass = new Glass({
    taskPaths: './tasks',
    sort: (first, second) => basename(first)[0] > basename(second)[0] ? -1 : 0,
});
glass.loadTasks();