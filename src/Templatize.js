import get from 'lodash/get.js'
import isArray from 'lodash/isArray.js'
import isFunction from 'lodash/isFunction.js'
import isString from 'lodash/isString.js'
import isObject from 'lodash/isObject.js'
import flattenDeep from 'lodash/flattenDeep.js'
import zip from 'lodash/zip.js'
import {get as rootGet}  from './dataStore.js'

export default (strings, ...keys) => templates => values => {
    const dict = values ?? {}
    const subTemps = templates ?? {}
    const result = keys.map((key, i) => {
        let v;
        if (key === '.') {
            v = dict
        } else if (key.startsWith('/')) {
            v = rootGet(key.split('/').slice(1))
        } else {
            v = get(dict, key)
        }
        if (v) {
            if (subTemps[key]) {
                if (isFunction(subTemps[key])) { // Execute a formatter function
                    return subTemps[key](isObject(v) ? v : {[key]: v})
                } else if (isString(subTemps[key])) { // Display a fixed value
                    return subTemps[key]
                } else if (isObject(subTemps[key])) { // Look up the displayed value
                    return subTemps[key][v]
                } else {
                    throw('unknown template type')
                }
            }
            if (isString(v)) {
                return v
            } else if (isArray(v) || isObject(v)) {
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
