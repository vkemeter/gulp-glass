'use strict';

const {
    isString,
    isPlainObject,
    isArray,
    isFunction,
} = require('lodash');

const glob = require('glob');
const gulp = require('gulp');
const path = require('path');

class Glass {
    /**
     * Constructor
     *
     * @param {Object?} configuration
     * @returns {Glass}
     */
    constructor(configuration) {
        this.taskPaths = [];
        this.filePattern = '**/*.js';
        this.sort = undefined;
        this.nameResolver = (file) => path.basename(file, path.extname(file));

        if (isString(configuration)) {
            this.taskPaths = [configuration];
        } else if (isPlainObject(configuration)) {
            if (isString(configuration.taskPaths)) {
                this.taskPaths = [configuration.taskPaths];
            }

            if (isArray(configuration.taskPaths)) {
                this.taskPaths = configuration.taskPaths;
            }

            if (isString(configuration.filePattern)) {
                this.filePattern = configuration.filePattern;
            }

            if (isFunction(configuration.nameResolver)) {
                this.nameResolver = configuration.nameResolver;
            }

            if (isFunction(configuration.sort)) {
                this.sort = configuration.sort;
            }
        }
    }

    /**
     * Loads all gulp tasks
     *
     * @returns {gulp}
     */
    loadTasks() {
        // Consolidating file list from task paths
        let files = this.taskPaths.reduce((accumulatedFiles, taskPath) => {
            const filesInPath = glob.sync(this.filePattern, { cwd: taskPath });
            return [
                ...accumulatedFiles,
                ...filesInPath.map((file) => path.join(path.resolve(taskPath), file)),
            ];
        }, []);

        // Sorting files
        if (this.sort) {
            files = files.sort(this.sort);
        }

        // Registering tasks
        files.forEach((file) => {
            // eslint-disable-next-line global-require,import/no-dynamic-require
            const taskFunction = require(file);
            const taskNames = isArray(taskFunction.alias)
                ? taskFunction.alias
                : isString(taskFunction.alias)
                    ? [taskFunction.alias]
                    : [this.nameResolver(file)];

            if (taskFunction.enabled === true) {
                taskNames.forEach((taskName) => gulp.task(taskName, taskFunction));
            }
        });

        return gulp;
    }
}

module.exports = Glass;
