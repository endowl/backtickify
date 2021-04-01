import isFunction from 'lodash/isFunction.js'
import {get as rootGet} from "./dataStore.mjs";

const inlineList = defaultValue => v => {
    if (!v) {
        return defaultValue || '<empty list>'
    }
    if (v.length > 1) {
        let i = v.slice(0, v.length - 1)
            .map(w => w.toString())

        i.push(`and ${v[v.length - 1]}`)
        if (i.length > 2) { // oxford comma
            // [x, y, z] -> "x, y, and z"
            return i.join(', ')
        } else {
            // [x, y] -> "x and y"
            return i.join(' ')
        }
    } else if (v.length === 1) {
        // [x] -> "x"
        return v[0];
    } else {
        return defaultValue || '<empty list>'
    }
}

const parseKey = key_ => {
    let _useThis = key_.endsWith('>')
    let _useRoot = key_.startsWith('/')
    let _k = key_.slice(_useRoot ? 1 : 0, _useThis ? -1 : undefined)
    if (_useRoot) {
        _k = _k.split('/')
    }
    return {_useThis, _useRoot, _k};
}

const bind = (key_, template_) => {
    let {_useThis, _useRoot, _k} = parseKey(key_)
    return v_ => {
        if (!isFunction(template_)) return template_
        let _v = _useRoot ? rootGet(_k) : v_
        if (!_v || !(_useRoot || _v[_k])) return '' // Value is undefined
        let scope = _useThis || _useRoot ? _v : _v[_k]
        return template_(scope)
    }
}

const each = template => v => v.map(w => isFunction(template) ? template(w) : template).join('\n\n')

export {inlineList, parseKey, bind, each}