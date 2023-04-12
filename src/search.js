const QueryBuilder = require("./queryBuilder")

/**
 * It will make sure that `data` and `query` are in their
 * right types i.e. `data` being an Array and `query` being
 * a JSON object.
 */
function assertParamsAreUpToExpectations({ data, query }) {
  /**
   * Lets make sure `data` is always an array
   * as the search is logic is based on the
   * `array.prototype` functions.
   */
  const dataNotAnArray = !Array.isArray(data)
  if (dataNotAnArray) {
    throw new Error('Data must be an array')
  }
  
  /**
   * Lets also make sure that `query` is a JSON
   * object as well
   */
  const isObject = typeof query === 'object'
  const queryNotAnArray = !Array.isArray(query)
  const isQueryJson = isObject && queryNotAnArray
  const isQueryEmptyArray = Array.from(query).length === 0
  const queryEitherJsonOrEmptyArray = isQueryJson || isQueryEmptyArray
  if (!queryEitherJsonOrEmptyArray) {
    throw new Error('Query must be a JSON object OR an empty array')
  }
}

function find({ data, query }) {
  /** If `query` being `[]` then return all */
  if (Array.isArray(query) && query.length === 0) { return data }

  const qb = new QueryBuilder({ query })
  const expression = qb.build()
  const filtered = Array.from(data).filter(o => eval(expression))
  return filtered
}

module.exports = (data, query) => {
  assertParamsAreUpToExpectations({ data, query })
  return find({ data, query })
}