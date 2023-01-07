module.exports = {
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    pg_user: process.env.PG_USER,
    pg_host: process.env.PG_HOST,
    pg_database: process.env.PG_DATABASE,
    pg_port: process.env.PG_PORT,
    aws_endpoint: process.env.AWS_ENDPOINT,
    aws_region: process.env.AWS_REGION,
    aws_rdsDBSecretName: process.env.AWS_DBSECRETNAME
}