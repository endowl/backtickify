import _get from "lodash/get.js";
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";

// Singleton data provider

let data

function removeEmptyProps(s) {
    if (isPlainObject(s)) {
        return Object.keys(s).reduce((acc, k) => {
            if (isPlainObject(s[k])) {
                const t = removeEmptyProps(s[k])
                if (Object.keys(t).length) {
                    acc[k] = t
                }
            } else if (isArray(s[k])) {
                acc[k] = s[k].map(removeEmptyProps)
            } else if (s[k]) {
                acc[k] = s[k]
            }
            return acc
        }, {})
    }
    return s
}

export const set = r => data = removeEmptyProps(r)
export const get = p => _get(data, p)
export const getById = (p, k) => {
    const result =  get(p)?.find(e => {
        return e.id === k
    })
    return result
}
export const rootIsSet = () => !!data

export default {set, get, getById, rootIsSet}