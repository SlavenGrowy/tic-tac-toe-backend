import { DynamoDB } from "@aws-sdk/client-dynamodb"
const client = new DynamoDB({ endpoint: "http://localhost:8000" });

//Create a table
(async () => {
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

//Create an item
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

//Put item in db
client.putItem(params, function(err, data) {
    if (err) {
        console.log(err, err.stack);
    }
    else {
        console.log(data);
    }
});

//Item which we want to get
const params = {
    TableName: 'Students',
    Key: {
        'FN': {N: 98576},
        'Name': {S: "Petar Ivanov Stoyanov"}
    }
};

// Call DynamoDB to read the item from the table
client.getItem(params, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.Item);
    }
})

// Call DynamoDB to delete the item from the table
client.deleteItem(params, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data);
    }
});

