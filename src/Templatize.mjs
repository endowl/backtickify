import get from 'lodash/get.js'
import isArray from 'lodash/isArray.js'
import isFunction from 'lodash/isFunction.js'
import isString from 'lodash/isString.js'
import isObject from 'lodash/isObject.js'
import flattenDeep from 'lodash/flattenDeep.js'
import zip from 'lodash/zip.js'
import {get as rootGet}  from './dataStore.mjs'
import {parseKey} from "./helpers.mjs"

export default (strings, ...keys) => values => {
    const _values = values ?? {}
    const result = keys.map((key_) => {
        let _v;
        if (isFunction(key_) || key_ === '.') {
            _v = _values
        } else {
            let {_useThis, _useRoot, _k} = parseKey(key_)

            if (_useRoot) {
                _v = rootGet(_k)
            } else if (_useThis) {
                _v = _values
            } else {
                _v = get(_values, key_)
            }
        }
        if (_v) {
            let formatter = isFunction(key_) && key_
            if (formatter) {
                if (isFunction(formatter)) { // Execute a formatter function
                    return formatter(isObject(_v) ? _v : {[key_]: _v})
                } else if (isString(formatter)) { // Display a fixed value
                    return formatter
                // } else if (isObject(formatter)) { // Look up the displayed value
                //     return formatter[v]
                } else {
                    throw('unknown template type')
                }
            }
            if (isString(_v)) {
                return _v
            } else if (isArray(_v) || isObject(_v)) {
                throw 'arrays and objects require a template'
            } else {
                return ''
            }
        }
    })
    return flattenDeep(zip(strings, result))
        .join('')
        .trimStart()
        .trimEnd()
        .replace(/ +/g, ' ')
        .replace(/( +)?(\.)+/g, '.')
}
