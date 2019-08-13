# agna-gulp-glass
Glass is a task loader for gulp, making it possible to organize tasks into files and directories.

## Features
- Organize tasks into files and directories
- Specifying as many task path(s) as you wish

## Install
$ npm install git://github.com/agostone/agna-gulp-glass.git --save-dev

## Usage
Replace the contents of your gulpfile.js with the following:
```
const Glass = require('@agostone/gulp-glass');
const glass = new Glass(<configuration>);
glass.loadTasks();
```

### configuration
- Required: true
- Type: String|Object

If the configuration parameter is a simple string, it should point to a valid directory containing the task files.
Default pattern for finding task files is '\**/\*.js'.

If the configuration parameter is a plain javascript object, the structure is the following:
```
{
  taskPaths: '<path>'|['<path>', '<path>', ...],
  pattern: '<pattern>',
  sort: <function>,
  nameResolver: <function>
}
``` 
##### taskPaths
- Required: true
- Type: String|Array of strings

Path(s) containing task files.

##### pattern
- Required: false
- Type: String
- Default: '\**/\*.js'

Pattern describing task files.

##### sort
- Required: false
- Type: Function
- Default: Task files are ordered by full path/name in an ascending order.

If provided, defines the order used for loading task files.
This is a compare function for array.sort(), check the documentation for array.sort for more information.

##### nameResolver
- Required: false
- Type: Function
- Default: Name of the task is the filename without path and extension.

If provided, will be executed for each individual task file and should return with the desired task name.

For example (default behavior):
```
{
    nameResolver: (file) => path.basename(file, path.extname(file))
}
```

## Task registration
Task are automatically loaded and registered by agna-gulp-glass. 
Loading/registration order is defined by the sort, task names by the nameResolver configuration parameter.

### Examples
Filename: '/tasks/minify.js'

Task name: minify

Filename: '/tasks/minify.css.js'

Task name: minify.css

## Task files
Task files are regular node.js modules, they should export a gulp task function.

### Example
```
'use strict';

const { src, dest } = require('gulp');

module.exports = function() {
  return src('src/*.js')
    .pipe(dest('output/'));
}
```

## Running the tests
```
$ jasmine
```

## Creating the docs
```
$ jsdoc --verbose -c ./jsdoc/configuration.json Glass.js
```

## Todo
- Lazy loading tasks, only when gulp really needs them
- Task aliasing
- Registering in NPM
