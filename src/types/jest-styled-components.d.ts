/* eslint-disable @typescript-eslint/no-explicit-any */
/* @typescript-eslint/ban-ts-comment */
import { NewPlugin } from 'pretty-format'
import { css } from 'styled-components'
declare global {
  namespace jest {
    /* @typescript-eslint/no-unsafe-function-type */
    interface AsymmetricMatcher {
      $$typeof: symbol
      sample?: string | RegExp | object | Array<any> | Function
    }
    type Value = string | number | RegExp | AsymmetricMatcher | undefined
    interface Options {
      media?: string
      modifier?: string | ReturnType<typeof css>
      supports?: string
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R, T> {
      toHaveStyleRule(property: string, value?: Value, options?: Options): R
    }
  }
}
export interface StyledComponentsSerializerOptions {
  addStyles?: boolean
  classNameFormatter?: (index: number) => string
}
export declare const styleSheetSerializer: NewPlugin & {
  setStyleSheetSerializerOptions: (
    options?: StyledComponentsSerializerOptions
  ) => void
}
