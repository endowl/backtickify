import _get from "lodash/get.js";
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";

// Singleton data provider

let data

function removeEmptyProps(s) {
    if (isPlainObject(s)) {
        const t = Object.keys(s).reduce((acc, k) => {
            const newVal = removeEmptyProps(s[k])
            if (newVal) {
                acc[k] = newVal
            }
            return acc
        }, {})
        if (t && Object.keys(t).length) {
            return t
        }
    } else if (isArray(s)) {
        const t = s.map(removeEmptyProps)
        if (t && t.length) {
            return t
        }
    } else if (s) {
        return s
    }
}

export const set = r => data = removeEmptyProps(r)
export const get = p => _get(data, p)
export const getById = (p, k) => get(p)?.find(e => e.id === k)
export const rootIsSet = () => !!data

export default {set, get, getById, rootIsSet}