import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { v4 as uuid } from "uuid";

const client = new DynamoDB({ endpoint: "http://localhost:8000" });

class User {
    constructor(username) {
        this._username = username;
    }

    get username() {
        return this._username;
    }

    set username(newName) {
        this._username = newName;
    }

    add() {
        const params = {
            TableName: "OnlineUsers",
            Item: {
                ID: {N: uuid.v4()},
                username: {S: this._username}
            },
        };

        client.putItem(params, function (err) {
            if (err) {
                console.error("Unable to add user!", err);
            } else {
                console.log(`${this._username} added successfully!`);
            }
        })
    }

    delete() {
        const params = {
            TableName: "OnlineUsers",
            Key: {
                //ID: {N: 1}
            },
        };

        client.deleteItem(params, function (err) {
            if (err) {
                console.error("Unable to find user", err);
            } else {
                console.log(`${this._username} deleted!`);
            }
        });
    }

    getAll() {
        const params = {
            TableName: "OnlineUsers",
        };

        client.scan(params, function (err, data) {
            if (err) {
                console.error("Unable to find users", err);
            } else {
                console.log(data.Items);
            }
        });
    }
}
