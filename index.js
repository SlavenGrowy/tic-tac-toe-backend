import { DynamoDB } from "@aws-sdk/client-dynamodb"

const node_env = process.env.NODE_ENV;
const setup_db = process.env.SETUP_DB;

if ((node_env !== 'production') && (setup_db==='true')) {
    const client = new DynamoDB({endpoint: "http://localhost:8000"});

//Create a table
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
} else {
    console.log('Error');
}