import _get from "lodash/get.js";

// Singleton data provider

let data

const set = r => data = r
const get = p => _get(data, p)
const getById = (p, k) => get(p).find(e => e.id === k)

export {set, get, getById}