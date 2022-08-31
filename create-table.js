import { DynamoDB } from "@aws-sdk/client-dynamodb"

const NODE_ENV = process.env.NODE_ENV;
const SETUP_DB = process.env.SETUP_DB | true;

if (NODE_ENV === 'production' && !SETUP_DB) {
    throw new Error("Cannot create a table, because you are in production and your database is set to false!");
} else {
    const client = new DynamoDB({endpoint: "http://localhost:8000"});

    (async () => {
        try {
            const params = {
                AttributeDefinitions: [
                    {
                        AttributeName: "ID",
                        AttributeType: "N",
                    }
                ],
                KeySchema: [
                    {
                        AttributeName: "ID",
                        KeyType: "HASH"
                    }
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5,
                },
                TableName: "OnlineUsers",
            };
            const createTableCommandOutput = await client.createTable(params);
            await new Promise(resolve => setTimeout(resolve, 3000));
            const results = await client.listTables({});
            console.log(results.TableNames.join("\n"));
        } catch (err) {
            console.error(err);
        }
    })();
}