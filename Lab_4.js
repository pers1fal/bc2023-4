const http = require('http');
const fs = require('fs');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

const port = 8000;
const server = http.createServer((req, res) => {
    const xmlData = fs.readFileSync('data.xml');
    const parser = new XMLParser();
    const jsonData = parser.parse(xmlData);
    const currencies = jsonData.exchange.currency;

    if (typeof currencies === 'object' && currencies !== null) {
        const newXMLData = {
            data: {
                exchange: {
                    date: currencies.exchangedate,
                    rate: currencies.rate,
                },
            },
        };

        const builder = new XMLBuilder({});
        const xmlres = builder.build(newXMLData);

        res.setHeader('Content-Type', 'text/xml');
        res.end(xmlres);
    } else {
        console.error('Неправильний формат даних для currencies.');
        res.statusCode = 500; // Internal Server Error
        res.end('Internal Server Error: ' + JSON.stringify(currencies));
    }
});

server.listen(port, () => {
    console.log(`Server is working!`);
});