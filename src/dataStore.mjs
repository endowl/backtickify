import _get from "lodash/get.js";

// Singleton data provider

let data

export const set = r => data = r
export const get = p => _get(data, p)
export const getById = (p, k) => get(p).find(e => e.id === k)

export default {set, get, getById}