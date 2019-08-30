/* eslint-disable no-underscore-dangle */

'use strict';

require('jasmine-expect');

const glassFile = require.resolve('../Glass');
const { basename } = require('path');

describe('agna-gulp-glass', () => {
    let Glass;

    // Unloading gulp & glass
    beforeEach(() => {
        delete require.cache[glassFile];
        delete require.cache[require.resolve('gulp')];

        // eslint-disable-next-line global-require
        Glass = require('../Glass');
    });

    it('should load tasks in directory taskPath1', () => {
        const glass = new Glass(`${__dirname}/taskPath1`);
        const gulp = glass.loadTasks();

        const tasks = gulp._registry.tasks();
        const taskNames = Object.getOwnPropertyNames(tasks);
        expect(taskNames.length).toBe(2);

        taskNames.forEach((taskName) => {
            // eslint-disable-next-line global-require,import/no-dynamic-require
            const task = require(`${__dirname}/taskPath1/${taskName}`);

            expect(tasks[taskName]).toBeFunction();
            expect(tasks[taskName].unwrap()).toBe(task);
        });
    });

    it('should load task files matching the pattern \'*.task.js\' in directory taskPath1 and taskPath2', () => {
        const glass = new Glass({
            taskPaths: [`${__dirname}/taskPath1`, `${__dirname}/taskPath2`],
            filePattern: '**/*.task.js',
        });
        const gulp = glass.loadTasks();

        const tasks = gulp._registry.tasks();
        const taskNames = Object.getOwnPropertyNames(tasks);
        expect(taskNames.length).toBe(2);

        taskNames.forEach((taskName) => {
            expect(tasks[taskName]).toBeFunction();
            expect(tasks[taskName].unwrap()).toBeFunction();
            expect(taskName.indexOf('.task') > 0).toBeTruthy();
        });
    });

    it('should load task(s) according to the defined sort function', () => {
        const glass = new Glass({
            taskPaths: `${__dirname}/taskSort`,
            sort: (first, second) => {
                const f = basename(first).charCodeAt(0);
                const t = basename(second).charCodeAt(0);
                return f < t
                    ? 1
                    : f > t
                        ? -1
                        : 0;
            },
        });

        const gulp = glass.loadTasks();
        const tasks = Object.getOwnPropertyNames(gulp._registry.tasks());
        expect(tasks.length).toBe(3);
        expect(tasks[0]).toBe('test1');
        expect(tasks[1]).toBe('test2');
        expect(tasks[2]).toBe('default');
    });

    it('should name task(s) according to the name resolver', () => {
        const glass = new Glass({
            taskPaths: `${__dirname}/taskPath1`,
            nameResolver: (file) => basename(file)[0],
            filePattern: '**/*.task.js',
        });
        const gulp = glass.loadTasks();
        const tasks = Object.getOwnPropertyNames(gulp._registry.tasks());
        expect(tasks.length).toBe(1);
        expect(tasks[0]).toBe('t');
    });

    it('should name task(s) according to the specified alias(es)', () => {
        const glass = new Glass(`${__dirname}/taskAlias`);
        const gulp = glass.loadTasks();

        const tasks = gulp._registry.tasks();
        const taskNames = Object.getOwnPropertyNames(tasks);
        expect(taskNames.length).toBe(3);

        taskNames.forEach((taskName) => {
            expect(tasks[taskName]).toBeFunction();
            expect(tasks[taskName].unwrap()).toBeFunction();
            expect(['testAlias1', 'testAlias2', 'testAlias3'].indexOf(taskName) >= 0).toBeTruthy();
        });
    });
});
