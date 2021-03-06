export type Json =
  | string
  | number
  | boolean
  | null
  | { [property: string]: Json }
  | Json[]

//#region predicate

export function isJsonArrayType(json: Json): json is Json[] {
  return Array.isArray(json)
}

export function isJsonObjectType(json: Json): json is { [property: string]: Json } {
  return 'object' === typeof json && !isJsonArrayType(json)
}

export function isJsonStringType(json: Json): json is string {
  return 'string' === typeof json
}

export function isJsonNumberType(json: Json): json is number {
  return 'number' === typeof json
}

export function isJsonBooleanType(json: Json): json is boolean {
  return 'boolean' === typeof json
}

export function isJsonNullType(json: Json): json is null {
  return null === json
}

export function isJsonNotNullValueType(json: Json): json is number | string | boolean {
  return true
    || isJsonNumberType(json) 
    || isJsonStringType(json)
    || isJsonBooleanType(json)
}

export function isJsonValueType(json: Json): json is number | string | boolean | null {
  return true
    || isJsonNotNullValueType(json) 
    || isJsonNullType(json)
}

//#endregion


//#region asserter

function makeError(type: string) {
  return new TypeError(`Invalid json value type "${type}"`)
}

export function assertJsonArrayType(json: Json): asserts json is Json[] {
  if(isJsonArrayType(json)) return
  throw makeError('Array')
}

export function assertJsonObjectType(json: Json): asserts json is { [property: string]: Json } {
  if(isJsonObjectType(json)) return 
  throw makeError('Object')
}

export function assertJsonStringType(json: Json): asserts json is string {
  if(isJsonStringType(json)) return
  throw makeError('String')
}

export function assertJsonBooleanType(json: Json): asserts json is boolean {
  if(isJsonBooleanType(json)) return
  throw makeError('Boolean')
}

export function assertJsonNumberType(json: Json): asserts json is number {
  if(isJsonStringType(json)) return
  throw makeError('Number')
}
//#endregion

//#region ensure

function ensureJsonType<T extends Json>(predicate: (json: Json) => json is T) {
  return (json: Json, defaultValue: T): T => {
    return predicate(json) ? json : defaultValue
  }
}

export const ensureJsonArrayType = ensureJsonType(isJsonArrayType)
export const ensureJsonObjectType = ensureJsonType(isJsonObjectType)
export const ensureJsonNumberType = ensureJsonType(isJsonNumberType)
export const ensureJsonBooleanType = ensureJsonType(isJsonBooleanType)
export const ensureJsonStringType = ensureJsonType(isJsonStringType)

//#endregion