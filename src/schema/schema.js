import pkg from 'graphql';
const { buildSchema } = pkg;

const schema = buildSchema(`
    type Currencies {
        Id: Int
        Name: String
    }

    input CurrenciesInput {
        Id: Int
        Name: String!
    }

    input DeleteCurrenciesInput{
        Name: String!
    }

    input UpdateCurrenciesInput {
        Id: Int
        Name: String!
    }


    type Query {
        getAllCurrencies: [Currencies]
        getCurrencies(Id: ID): Currencies
        getAllCurrenciesFromMain: [Currencies]
    }
    type Mutation {
        createCurrency(input: CurrenciesInput): Currencies 
        deleteCurrency(input: DeleteCurrenciesInput): Currencies 
        updateCurrency(input: UpdateCurrenciesInput): Currencies
    }
`);

export default schema;