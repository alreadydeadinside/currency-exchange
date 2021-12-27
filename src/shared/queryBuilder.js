class QueryBuilder {
  constructor() {
    this._query = {
      selectBody: '',
      joinBody: '',
      orderBody: '',
      whereBody: '',
    };
  }

  select(queries, table) {
    this._query.selectBody += `SELECT ${queries.join(', ')} FROM ${table}`;
    return this;
  }

  innerJoin(table, left, right) {
    this._query.joinBody += `INNER JOIN ${table} ON ${left} = ${right}\n`;
    return this;
  }

  leftJoin(table, left, right) {
    this._query.joinBody += `LEFT JOIN ${table} ON ${left} = ${right}\n`;

    return this;
  }

  where(field) {
    this._query.whereBody += `WHERE ${field}`;
    return this;
  }

  execute() {
    const query = Object.values(this._query).join('\n');
    this.resetQuery();

    return query;
  }

  resetQuery() {
    Object.keys(this._query).forEach((key) => (this._query[key] = ''));
  }
}

export default QueryBuilder;
