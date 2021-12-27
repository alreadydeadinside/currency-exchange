import sql from 'mssql';
import express from 'express';
import { firstProviderConfig } from '../../config/index.js';
import { FirstProviderService } from '../../services/index.js';

const getRandomString = (length) => {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

function startServer() {
    const providerService = new FirstProviderService();
    const app = express();
    app.get('/', async function (req, res) {
        await sql.connect(firstProviderConfig.database);
        const query = `SELECT * FROM Currencies`;
        const result = await sql.query(query);
        setTimeout(()=>  res.send(result['recordsets']), 20000);
    });

    app.get('/search', async (req, res) => {
        const searchQuery = req.query['query'];
        const currencies = await providerService.getByTitle(searchQuery);
        setTimeout(()=> res.send(currencies), 20000);
    });

    app.post('/insertCurrencies', async (req, res) => {
        await sql.connect(firstProviderConfig.database);
        for (let index = 0; index < 100000; index++) {
            let pool = await sql.connect(firstProviderConfig.database)
            const request = pool.request()
            const name = getRandomString(3);
            request.input('name', sql.NVarChar, name)
            request.query('INSERT Currencies (Name) values (@name)', (err, result) => {
                console.log(err)
            })
        }
        res.send()
    });



    console.info(`Listening on port http://localhost:${firstProviderConfig.firstPort}`);

    app.listen(firstProviderConfig.firstPort);
}

startServer();
