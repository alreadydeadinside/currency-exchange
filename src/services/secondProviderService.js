import QueryBuilder from '../shared/queryBuilder.js';
import Singleton from '../shared/singleton.js';
import {secondProviderConfig} from '../config/index.js';
import fetch from 'node-fetch';

class SecondProviderService {
  constructor() {
    this.queryBuilder = new QueryBuilder();
    this.singleton = Singleton.getInstance(secondProviderConfig.database);
  }

  async getById(id) {
    const query = this.queryBuilder
      .select(['*'], 'Currencies')
      .where(`Id = ${id}`)
      .execute();

    const result = await this.singleton.executeQuery(query);

    return result;
  }

}

export { SecondProviderService };
