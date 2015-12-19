import Promise = require('native-or-bluebird')

export interface Options {
  rejectOnErrors?: boolean
}

export function loadApi (path: string, extensions?: string[], options?: Options): Promise<any>;
export function loadApiSync (path: string, extensions?: string[], options?: Options): any;
