#!/bin/bash
awslocal secretsmanager create-secret \
    --name "rds-db-secret-name" \
    --description "Secret associated with primary RDS DB instance" \
    --secret-string "{\"username\":\"EXAMPLE-USERNAME\",\"password\":\"EXAMPLE-PASSWORD\"}"