import { DynamoDB } from "@aws-sdk/client-dynamodb"
const client = new DynamoDB({ endpoint: "http://localhost:8000" });

(async () => {
    const client = new DynamoDB({ endpoint: "http://localhost:8000" });
    try {
        const params = {
            AttributeDefinitions: [
                {
                    AttributeName: "FN",
                    AttributeType: "N",
                },
                {
                    AttributeName: "Name",
                    AttributeType: "S",
                },
            ],
            KeySchema: [
                {
                    AttributeName: "FN",
                    KeyType: "HASH",
                },
                {
                    AttributeName: "Name",
                    KeyType: "RANGE",
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
            TableName: "Students",
        };
        const createTableCommandOutput = await client.createTable(params);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const results = await client.listTables({});
        console.log(results.TableNames.join("\n"));
    } catch (err) {
        console.error(err);
    }
})();

//put item in db
const params = {
    Item: {
        FN: {
            N: "98576"
        },
        Name: {
            S: "Petar Ivanov Stoyanov"
        }
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: "Students",
};

client.putItem(params, function(err, data) {
    if (err) {
        console.log(err, err.stack);
    }
    else {
        console.log(data);
    }
});