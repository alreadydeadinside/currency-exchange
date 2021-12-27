import QueryBuilder from '../shared/queryBuilder.js';
import Singleton from '../shared/singleton.js';
import {mainConfig} from '../config/index.js';
import fetch from 'node-fetch';

class CurrencyService {
  constructor() {
    this.queryBuilder = new QueryBuilder();
    this.singleton = Singleton.getInstance(mainConfig.database);
  }

  async getAll() {
    const query = this.queryBuilder.select(['*'], 'Currencies').execute();
    const firstProvider = await fetch('http://localhost:3001');
    const secondProvider = await fetch('http://localhost:3002/exotic-currencies');
    const firstData = await firstProvider.json();
    const secondData = await secondProvider.json();
    const result = await this.singleton.executeQuery(query);
    const final = result.concat(firstData, secondData);
    return final;
  }

  async getById(id) {
    const query = this.queryBuilder
      .select(['*'], 'Currencies')
      .where(`Id = ${id}`)
      .execute();

    const result = await this.singleton.executeQuery(query);

    return result;
  }

  async getByTitle(title) {
    const query = this.queryBuilder
      .select(['*'], 'Currencies')
      .where(`Name LIKE \'${title}%\'`)
      .execute();

    const result = await this.singleton.executeQuery(query);

    return result;
  }

  async exchange(fromId, toId, amount) {
    let query = this.queryBuilder
      .select(['*', `(${amount} * Rate) as Result`], 'ExchangeRates')
      .where(`(SourceCurrencyId = ${fromId} AND TargetCurrencyId = ${toId})`)
      .execute();
    let result = await this.singleton.executeQuery(query);

    if (result[0].length != 0) {
      return result;
    }

    query = this.queryBuilder
      .select(['*', `(${amount} / Rate) as Result`], 'ExchangeRates')
      .where(`(SourceCurrencyId = ${toId} AND TargetCurrencyId = ${fromId})`)
      .execute();
    result = await this.singleton.executeQuery(query);

    return result[0];
  }
}

export { CurrencyService };
