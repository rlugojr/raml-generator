# RAML Generator

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

Generate files from a RAML document and templates.

## Installation

```
npm install raml-generator --save
```

## Usage

The module accepts a map of functions (usually compiled templates, such as Handlebars) and helper functions, and returns a function that will generate files given an instance of the RAML 1 parser API.

For an example module, take a look at the [raml-javascript-generator](https://github.com/mulesoft-labs/raml-javascript-generator).

### JavaScript Usage

Create the generator function from an object specification. The returned object accepts two parameters, the RAML object and user package information.

```js
var fs = require('fs')
var Handlebars = require('handlebars')
var generator = require('raml-generator')

module.exports = generator({
  templates: {
    'index.js': Handlebars.compile(fs.readFileSync(__dirname + '/templates/index.js.hbs', 'utf8'))
  },
  helpers: {
    stringify: require('javascript-stringify')
  }
}) //=> [Function]
```

### Bin Script

A `bin` script is provided for you to use with your custom generator. Just require `raml-generator/bin` and pass in the generator function (from above), package information (`package.json`) and `process.argv`.

```js
#!/usr/bin/env node

var bin = require('raml-generator/bin')

var generator = /* The generator function */

bin(generator, require('./package.json'), process.argv)
```

## License

Apache License 2.0

[npm-image]: https://img.shields.io/npm/v/raml-generator.svg?style=flat
[npm-url]: https://npmjs.org/package/raml-generator
[downloads-image]: https://img.shields.io/npm/dm/raml-generator.svg?style=flat
[downloads-url]: https://npmjs.org/package/raml-generator
[travis-image]: https://img.shields.io/travis/mulesoft-labs/raml-generator.svg?style=flat
[travis-url]: https://travis-ci.org/mulesoft-labs/raml-generator
[coveralls-image]: https://img.shields.io/coveralls/mulesoft-labs/raml-generator.svg?style=flat
[coveralls-url]: https://coveralls.io/r/mulesoft-labs/raml-generator?branch=master
