import get from 'lodash/get.js'
import isFunction from 'lodash/isFunction.js'
import isString from 'lodash/isString.js'
import isObject from 'lodash/isObject.js'
import flattenDeep from 'lodash/flattenDeep.js'
import zip from 'lodash/zip.js'
import {get as rootGet, rootIsSet, set} from './dataStore.mjs'
import {parseKey} from "./helpers.mjs"

const getScope = (k, v) => {
    if (isFunction(k)) {
        return v
    }
    if (isString(k)) {
        let {_useThis, _useRoot, _k} = parseKey(k)

        if (_useRoot) {
            return rootGet(_k)
        }
        if (_useThis) {
            return v
        }
        return get(v, k)
    }
    return null
}

const Templatize = f_ => (strings, ...keys) => v_ => {
    if (!rootIsSet()) {
        set(v_)
    }
    const result = keys.map(_k => {
        const scope = getScope(_k, v_ || {});
        if (scope) {
            if (isString(scope)) {
                return scope
            }
            if (_k && isFunction(_k) && isObject(scope)) { // Execute a formatter function
                return _k(scope)
            }
        }
        return null
    })
    return f_(flattenDeep(zip(strings, result)).join(''))
}

const I = s => s

const markdownFilter = s => s
    // Remove lines with only a period
    .replace(/\n\.\n/g, '.\n')
    // Remove consecutive blank lines
    .replace(/\n{2,}/g, '\n\n')
    // Remove consecutive spaces
    .replace(/ +/g, ' ')
    // Remove space before periods
    .replace(/ \./g, '.')
    // Remove consecutive periods
    .replace(/\.+/g, '.')
    // Remove spaces at the end of a line
    .replace(/ *\n/g, '\n')
    // Combine lines that are continuations of the previous
    .replace(/([^\n])\n([^\n\*\#\>\=\-\+\d\!\s\`])/g, '$1 $2')

const T = Templatize(markdownFilter)

export default T
