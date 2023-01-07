const keys = require('./keys');

// AWS secrets manager Setup

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: keys.AWS_region,
});

const secretsManager = new AWS.SecretsManager({
    region: keys.AWS_region,
    endpoint: keys.AWS_endpoint,
});
secretsManager.listSecrets({}, ((err, data) => {
    console.log('err secrets', err);
    console.log('success secrets', data);

}))


// const { SecretsManagerClient, ListSecretsCommand } = require("@aws-sdk/client-secrets-manager");

// const secretsManagerClient = new SecretsManagerClient({
//     region: "us-east-1",
//     credentials: {
//         accessKeyId: 'accessKeyId',
//         secretAccessKey: 'secretAccessKey'
//     },
//     endpoint: "aws-localstack:4566"
// });


// const getSecretValueCommand = new GetSecretValueCommand({
//     SecretId: 
// });
// const listSecretsCommand = new ListSecretsCommand({});
// secretsManagerClient.send(listSecretsCommand).then((secretResponse) => {
//     console.log(secretResponse);
//     console.log('just posted secret response');
// }).catch((err) => {
//     console.log('got an error');
//     console.error(err);
// });

// console.log(secretsManagerClient.config);
// var params = {
//     SecretId: "MyTestDatabaseSecret"
// };
// secretsManager.get(params, function (err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else console.log(data);           // successful response
//     /*
//     data = {
//      ARN: "arn:aws:secretsmanager:us-west-2:123456789012:secret:MyTestDatabaseSecret-a1b2c3", 
//      CreatedDate: <Date Representation>, 
//      Name: "MyTestDatabaseSecret", 
//      SecretString: "{\n  \"username\":\"david\",\n  \"password\":\"EXAMPLE-PASSWORD\"\n}\n", 
//      VersionId: "EXAMPLE1-90ab-cdef-fedc-ba987SECRET1", 
//      VersionStages: [
//         "AWSPREVIOUS"
//      ]
//     }
//     */
// });

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.log('Lost PG connection!'))
pgClient.on('connect', (client) => {
    client
        .query('CREATE TABLE IF NOT EXISTS values (number INT)')
        .catch((err) => console.error(err));
});

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values');

    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({ working: true });
});

app.listen(5000, err => {
    console.log('Listening');
});