import sql from 'mssql';
import express from 'express';
import { secondProviderConfig } from '../../config/index.js';
import { SecondProviderService } from '../../services/index.js';

const getRandomString = (length) => {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

function startServer() {
    const app = express();
    const providerService = new SecondProviderService();
    app.get('/exotic-currencies', async function (req, res) {
        await sql.connect(secondProviderConfig.database);
        const query = `SELECT * FROM Currencies`;
        const result = await sql.query(query);
        res.send(result['recordsets']);
    });

    app.get('/exotic-currencies/:page', async function (req, res) {
        const {page} = req.params;
        await sql.connect(secondProviderConfig.database);
        const query = `SELECT TOP (${page * 5000}) * FROM Currencies`;
        const result = await sql.query(query);
        res.send(result['recordsets']);
    });

    app.post('/insertCurrencies', async (req, res) => {
        await sql.connect(secondProviderConfig.database);
        for (let index = 0; index < 50000; index++) {
            let pool = await sql.connect(secondProviderConfig.database)
            const request = pool.request()
            const name = getRandomString(3);
            request.input('name', sql.NVarChar, name)
            request.query('INSERT Currencies (Name) values (@name)', (err, result) => {
                console.log(err)
            })
        }
        res.send()
    });

    app.get('/exotic-currencies/details/:currencyId', async (req, res) => {
        const { currencyId } = req.params;
        const currency = await providerService.getById(currencyId);
        res.send(currency);
    });
    console.info(`Listening on port http://localhost:${secondProviderConfig.secondPort}`);

    app.listen(secondProviderConfig.secondPort);
}

startServer();
