import extend = require('xtend')
import * as defaultHelpers from './helpers'

/**
 * The template functions, from the user.
 */
export interface Templates {
  [name: string]: Function
}

/**
 * A files object, should be returned by the user.
 */
export interface Files {
  [filename: string]: string
}

/**
 * Interface for additional data used in the files handler.
 */
export interface GenerateOptions {
  api: any
  helpers: Helpers
  data: any
}

/**
 * Helper functions, from the user.
 */
export interface Helpers {
  [key: string]: any
}

/**
 * Generation options.
 */
export interface Options {
  helpers?: Helpers
  templates: Templates
  generate?: (templates: Templates, options: GenerateOptions) => Files
}

/**
 * The result of any generator function.
 */
export interface GeneratorResult {
  files: Files
  api: any
  options: Options
}

/**
 * Type signature of a generator function.
 */
export type Generator = (api: any, data?: any) => GeneratorResult

/**
 * Create a generator using simple set up options.
 */
export function generator (options: Options): Generator {
  const helpers = extend(defaultHelpers, options.helpers)
  const generate = options.generate || defaultGenerate

  return function (api: any, data?: any) {
    const generateData: GenerateOptions = {
      data,
      helpers,
      api
    }

    const files = generate(options.templates, generateData)

    // Return access to all the information for runtime services.
    return { files, api, options }
  }
}

/**
 * Compile templates into files.
 */
function defaultGenerate (templates: Templates, options: GenerateOptions) {
  const files: Files = {}

  Object.keys(templates).forEach(function (key) {
    files[key] = templates[key](options)
  })

  return files
}
