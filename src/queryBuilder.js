class QueryBuilder {
    constructor({query}) {
        this.query = query
        this.queryExpression = ''
    }

    /**
     * This is to parse the value according to its
     * type. This is needed because when value is
     * of string type, it needs to be wrapped in quotes
     * for the `eval` to succeed. Other types work
     * as they are.
     */
    parseAccordingToType(value) {
        const isString = typeof value === 'string'
        if (isString) return `"${value}"`
        else return value
    }

    /**
     * This is needed to be build the whole query expression to make
     * sure we add the operator `&&` for each expression.
     */
    appendExpression({expression, value }) {
        if (this.queryExpression === '') {
            this.queryExpression += `${expression} === ${this.parseAccordingToType(value)} `
        } else {
            this.queryExpression += `&& ${expression} === ${this.parseAccordingToType(value)} `
        }
    }

    /**
     * Build the actual query expression.
     */
    build() {
        for (const key in this.query) {
            const value = this.query[key]
            if (key.includes('.')) {
                let expression = 'o'
                const keys = key.split('.')
                for (let i = 0; i < keys.length; i += 1) {
                    const nthKey = keys[i]
                    expression += `['${nthKey}']`
                }
                this.appendExpression({ expression, value })
            } else {
                this.appendExpression({ expression: `o['${key}']`, value })
            }
        }
        return this.queryExpression
    }
}

module.exports = QueryBuilder