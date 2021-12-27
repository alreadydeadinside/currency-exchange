import express, { response } from 'express';
import createRoutes from './loaders/index.js';
import { mainConfig } from './config/index.js';
import NodeCache from 'node-cache';
import fetch from 'node-fetch';
import sql from 'mssql'
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/schema.js';


function startServer() {
    const app = express();
    const cache = new NodeCache({ stdTTL: 20 });
    createRoutes(app);
    console.info(`Listening on port http://localhost:${mainConfig.mainPort}`);

    const currenciesSecondServiceURL = `http://localhost:3002/exotic-currencies`
    const currenciesFirstServiceURL = `http://localhost:3001/`;

    app.get("/get-allCurrencies", async (req, res) => {
        if (cache.has("currencies")) {
            console.log("Getting from cache");
            return res.send(cache.get("currencies"));
        } else {
            const firstData = await fetch(currenciesFirstServiceURL)
            const secondData = await fetch(currenciesSecondServiceURL)
            await sql.connect(mainConfig.database);
            const query = `SELECT * FROM Currencies`;
            const mainData = await sql.query(query)
            const recordsetsMainData = mainData['recordsets']
            const JSONfirst = await firstData.json()
            const JSONSecond = await secondData.json()
            const fullData = JSONfirst[0].concat(JSONSecond[0], recordsetsMainData);
            cache.set("currencies", fullData);
        }
    });
    const root = {
        getAllCurrencies: async () => {
            const firstData = await fetch(currenciesFirstServiceURL)
            const secondData = await fetch(currenciesSecondServiceURL)
            await sql.connect(mainConfig.database);
            const query = `SELECT * FROM Currencies`;
            const mainData = await sql.query(query)
            const recordsetsMainData = mainData['recordsets']
            const JSONfirst = await firstData.json()
            const JSONSecond = await secondData.json()
            const fullData = JSONfirst[0].concat(JSONSecond[0], recordsetsMainData);
            // console.log(fullData)
            return fullData
        },
        createCurrency: async({ input }) => {
            // console.log(input.Name);
            let pool = await sql.connect(mainConfig.database)
            const request = pool.request()
            request.input('name', sql.NVarChar, input.Name)
            request.query('INSERT Currencies (Name) values (@name)', (err, result) => {
                console.log(err)
            })
        },
        getAllCurrenciesFromMain: async()=>{
            await sql.connect(mainConfig.database);
            const query = `SELECT * FROM Currencies`;
            const mainData = await sql.query(query)
            const result = mainData['recordsets'];
            return result[0]
        },
        deleteCurrency: async(input)=>{
            console.log(input.input.Name);
            let pool = await sql.connect(mainConfig.database)
            const request = pool.request()
            request.input('name', sql.NVarChar, input.input.Name)
            request.query('DELETE FROM Currencies WHERE Name = @name', (err, result) => {
                console.log(err)
            })
        },
        updateCurrency: async(input)=>{
            console.log(input.input.Name);
            console.log(input.input.Id)
            let pool = await sql.connect(mainConfig.database)
            const request = pool.request()
            request.input('id', sql.Int, input.input.Id)
            request.input('name', sql.NVarChar, input.input.Name)
            request.query('UPDATE Currencies SET Name=@name WHERE Id=@id', (err, result) => {
                console.log(err)
            })
        },
    }

    app.use('/graphql', graphqlHTTP({
        graphiql: true,
        schema,
        rootValue: root
    })
    )

    app.listen(mainConfig.mainPort);
}

startServer();
