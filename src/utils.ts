import { isNil, isArray, isEqualWith, isString, isDate } from 'lodash'

const CHAR_PRESETS = {
  onlyLetters: 'abcdefghijklmnopqrstuvwxyz',
  onlyNumbers: '0123456789',
  hex: '0123456789abdef',
  letterAndNumbers:
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  common: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
} as any

export type Partial<T> = {
  [K in keyof T]?: T[K] extends Record<string, any> ? Partial<T[K]> : T[K]
}

/**
 * Help to keep the auto completion for use in partial objects
 * @param partialObj mock partial
 * @returns mock partial typed
 */
export function createPartial<T>(partial: Partial<T> = {}): T {
  return partial as T
}

/**
 * Flatten the value to a string if the value is an object.
 * @param value e.g. { foo: { bar: 'baz' } }
 * @returns Flattened value e.g. `{\n "foo": {\n "bar": "baz"\n }\n}`
 */
export function flatten(value: any) {
  // Return 'null' string to visualize null
  if (isNil(value)) {
    return 'null'
  }
  // Flatten the value if it is an array or an object
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 4)
  }
  return value
}

/**
 * Get a deep value from object by passing path as a string.
 * @param obj to get a value e.g. { foo: { bar: 'baz' } }
 * @param path of the value e.g. foo/bar
 * @param splitter Path splitter e.g. '/'
 * @param startIndex Set a number for ignoring paths
 * @returns Deep value of the object e.g. 'baz'
 */
export function getDeepValue(
  obj: object,
  path: string,
  splitter: string,
  startIndex: number = 0
) {
  if (isNil(obj)) {
    return obj
  }

  const paths = path.split(splitter)
  let value: any = obj
  for (let i = startIndex; i < paths.length; i++) {
    if (isNil(value[paths[i]])) {
      return value[paths[i]]
    }
    value = value[paths[i]]
  }
  return value
}

/**
 * Find a deep value from object by passing path as a string, then change it with a given value.
 * @param obj: Object to set a value e.g. { foo: { bar: 'baz' } }
 * @param path : Path of the value e.g. foo/bar
 * @param splitter : Path splitter e.g. '/'
 * @param value : Value to change e.g. 'qux'
 * => { foo: { bar: 'qux' } }
 * @returns true if success to change the value
 */
export function changeDeepValue(
  obj: object,
  path: string,
  splitter: string,
  value: any
) {
  if (isNil(path)) {
    return false
  }

  const paths = path.split(splitter)
  let ref: any = obj
  for (let i = 0; i < paths.length; i++) {
    if (i === paths.length - 1) {
      ref[paths[i]] = value
      return true
    }
    if (isNil(ref[paths[i]])) {
      return false
    }
    ref = ref[paths[i]]
  }
  return false
}

export function capitalizeFirstLetter(str: string): string {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  return ''
}

/*
 * Generate a random id string
 */
export function randomId(): string {
  return Math.random().toString(36).slice(2, 11)
}

export function nRandom(min: number, max: number): number {
  return min + Math.round(Math.random() * (max - min))
}

/**
 * Get a nested property on object or array
 * @param obj : current obj
 * @param path : path to property
 * @param defaultValue : default value case it does not exist
 * @returns the value of found property or a default value
 */
export function getProp(obj: any, path: string, defaultValue: any = null): any {
  if (!path || !obj) {
    return defaultValue
  }
  // magic to add support to arrays e.g: getProp(obj, 'mydata.result[0].name');
  path = path
    .replace(/\[['"]?([a-z0-9_]+)['"]?\]/gi, '.$1')
    .replace(/(^\.|\.$)/, '')
  const pathArr = path.split('.')
  return pathArr.reduce((tmp, prop) => {
    if (tmp && tmp[prop] !== undefined) {
      return tmp[prop]
    } else {
      return defaultValue
    }
  }, obj)
}

/**
 * checks if a nested property exists in object
 * @param obj current obj
 * @param path path to property to be find
 * @returns returns true the property is not undefined
 */
export function hasProp(obj: any, path: string): boolean {
  return !isNil(getProp(obj, path))
}

/**
 * execute a function random times
 * e.g: check a string
 * @param fn function to be execute
 * @param min min execution times
 * @param max max execution times
 */
export function execNTimes(fn: any, min = 1, max = 0) {
  let times = Math.max(min, 1)
  max = Math.max(max, min)
  if (max > 0) {
    times = nRandom(min, max)
  }
  new Array(times).fill('').forEach(fn)
}

/**
 * generate a random string
 * @param strLen string length
 * @param chars preset name or string containing the allowed chars
 * @returns random string
 */
export function randomString(strLen: number, type: string) {
  const chars = CHAR_PRESETS[type]
  const allowed = CHAR_PRESETS[chars] || chars
  const maxLen = allowed.length - 1
  return new Array(strLen)
    .fill('')
    .map(() => allowed[nRandom(0, maxLen)])
    .join('')
}

/**
 * create N items using
 * @param factoryFn
 * @param min
 * @param max
 * @returns
 */
export function createNItems<T>(
  factoryFn: (i: number) => T,
  min = 1,
  max?: number
): T[] {
  // if max is not informed create the exact number of min
  max = max || min
  return new Array(nRandom(min, max)).fill('').map((v, i) => factoryFn(i))
}

/**
 * pick a random item from arr
 * @param arr
 * @returns
 */
export function randomItem<T>(arr: T[]): T {
  const maxPos = Math.max(0, getProp(arr, 'length', 0) - 1)
  return arr[nRandom(0, maxPos)]
}

/**
 * pick a random value from enum
 * @param enumeration enum
 * @returns random enum value
 */
export function randomEnumValue<T extends object, K extends keyof T>(
  enumType: T
): T[K] {
  const values = Object.values(enumType) as T[K][]
  return randomItem(values)
}

export function MockingCast<T>(obj: any): T {
  return obj as T
}

/**
 * return a shuffled version of array
 * @param arr array of items
 * @returns shuffled array
 */
export function shuffleItems<T>(arr: T[]): T[] {
  return arr
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value)
}

/**
 * Generate a random date
 * @param min min date
 * @param max max date
 * @returns date between the range
 */
export function randomDate(min: Date, max: Date) {
  return new Date(nRandom(min.getTime(), max.getTime()))
}

/***
 * helper to find root element in unit tests, it can be useful when testing outside clicks in some components
 */
export function findUpBodyElement(element: Element) {
  if (!element) {
    return null
  }
  if (element.tagName === 'BODY') {
    return element
  }
  return element.parentElement
}

/**
 * Parses the query params after the ? from a URL e.g: test/?v1=10&test=true&test2=teststring
 * @param url
 * @returns an object with variables parsed e.g:
 * {
 * v1: "10",
 * test: "true",
 * test2: "teststring"
 * }
 */

export function urlQueryParamParser(url: any) {
  if (!/\?/.test(url) || !/=/.test(url)) {
    return null
  }
  return url
    .split('?')[1]
    .split('&')
    .reduce((tmp: any, query: string) => {
      const [paramName, paramValue] = query.split('=').map((v) => v.trim())
      tmp[paramName] = paramValue || ''
      if (/^\d+$/.test(tmp[paramName])) {
        tmp[paramName] = parseInt(tmp[paramName], 10)
      }
      if (/^(true|false)$/i.test(tmp[paramName])) {
        tmp[paramName] = /true/i.test(tmp[paramName])
      }
      return tmp
    }, {})
}

export function serializeUrlParams(
  queryParams: any,
  sortKeys: boolean = false
) {
  if (isNil(queryParams) || JSON.stringify(queryParams) === '{}') {
    return ''
  }

  const keys = Object.keys(queryParams)
  if (sortKeys) {
    keys.sort()
  }

  const serialized = keys
    .reduce((tmp: any, key) => {
      if (!isNil(queryParams[key])) {
        tmp.push(`${key}=${queryParams[key]}`)
      }
      return tmp
    }, [])
    .join('&')
  return serialized.trim() !== '' ? `?${serialized}` : ''
}

// Exclude the Date object
export function isObject(value: any) {
  return !isNil(value) && typeof value === 'object' && !isDate(value)
}

function customizer(value: any, other: any): boolean | undefined {
  // Compare the dates regardless of their formats
  if (isDate(value) && isDate(other)) {
    return new Date(value).getTime() === new Date(other).getTime()
  }
  // If customizer returns undefined, comparisons are handled by the method instead
  return undefined
}

export function isEqual(value: any, other: any) {
  if (isNil(value) && isNil(other)) {
    return true
  }
  if (isDate(value) && isDate(other)) {
    return new Date(value).getTime() === new Date(other).getTime()
  }
  return isEqualWith(value, other, customizer)
}

/**
 * creating a comparison to avoid the use of == to match number values with strings e.: 4 and '4'
 * @param a value
 * @param b value
 * @returns is equal
 */
export function isEqualNumberOrString(a: number | string, b: number | string) {
  if (isNil(a)) {
    a = ''
  }
  if (isNil(b)) {
    b = ''
  }
  return a.toString() === b.toString()
}

export function isStrHasValue(val: string, allowEmptyStr = false): boolean {
  return !isNil(val) && isString(val) && (val.trim() !== '' || allowEmptyStr)
}

export function numberFormat(n: string | number) {
  if (n || n === 0) {
    const numStr = typeof n === 'string' ? n : n.toString()
    const numArr = numStr.split(/(?=(?:\.|$))/g)
    if (numArr.length === 0) {
      return n
        .toString()
        .split(/(?=(?:\d{3})+(?:$))/g)
        .join(',')
        .replace('-,', '-')
    } else if (numArr.length === 1) {
      return numArr[0]
        .split(/(?=(?:\d{3})+(?:$))/g)
        .join(',')
        .replace('-,', '-')
    } else {
      return (
        numArr[0]
          .split(/(?=(?:\d{3})+(?:$))/g)
          .join(',')
          .replace('-,', '-') + numArr[1]
      )
    }
  }
  return ''
}

export function getQueryParam(
  route: any,
  key: string,
  converter: any,
  defaultValue = null
) {
  const params = route.snapshot.queryParams

  if (key in params) {
    return converter(params[key])
  }

  return defaultValue
}

export function paramAsArray(value: any) {
  if (isArray(value)) {
    return value
  }
  return [value]
}
