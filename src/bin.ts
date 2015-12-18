import Promise = require('native-or-bluebird')
import thenify = require('thenify')
import { dirname, resolve } from 'path'
import { loadApi } from 'raml-1-parser'
import yargs = require('yargs')
import mkdrp = require('mkdirp')
import fs = require('fs')
import parseJson = require('parse-json')
import { Generator, Files, GeneratorResult } from './index'

const mkdirp = thenify(mkdrp)
const readFile = thenify<string, string, string>(fs.readFile)
const writeFile = thenify<string, any, void>(fs.writeFile)

/**
 * Simple `package.json` interface.
 */
export interface Pkg {
  name: string
  description: string
  version: string
}

/**
 * Run the `bin` command for a consumer of the generator.
 */
export function bin (generator: Generator, pkg: Pkg, argv: string[]) {
  const cwd = process.cwd()

  // TODO(blakeembrey): Correct yargs type definition.
  const args = (yargs as any)
    .usage(`${pkg.description}\n\n$0 api.raml --output api-client`)
    .version(pkg.version, 'version')
    .demand('o')
    .alias('o', 'output')
    .describe('o', 'Output directory')
    .alias('d', 'data')
    .describe('d', 'Provide the path to a JSON data file')
    .array('include')
    .alias('i', 'include')
    .describe('i', 'Include additional files to parse (E.g. extensions)')
    .parse(argv)

  return loadApi(args._[2], args.include || [], { rejectOnErrors: true })
    .then(function (api: any) {
      if (args.data == null) {
        return Promise.resolve(generator(api))
      }

      const path = resolve(cwd, args.data)

      return readFile(path, 'utf8')
        .then(contents => parseJson(contents, null, path))
        .then(data => generator(api, data))
    })
    .then(function (output: GeneratorResult) {
      return objectToFs(resolve(cwd, args.output), output.files)
    })
    .then(function () {
      process.exit(0)
    })
    .catch(function (err: any) {
      console.error(err.stack || err.message || err)
      process.exit(1)
    })
}

/**
 * Save on object structure to the file system.
 *
 * @param  {String}  dir
 * @param  {Object}  object
 * @return {Promise}
 */
function objectToFs (path: string, object: Files) {
  return Object.keys(object).reduce(
    function (promise, file) {
      const content = object[file]
      const filename = resolve(path, file)
      const output = dirname(filename)

      return promise
        .then(function () {
          return mkdirp(output)
        })
        .then(function () {
          return writeFile(filename, content)
        })
    },
    mkdirp(path).then(() => undefined)
  )
}
