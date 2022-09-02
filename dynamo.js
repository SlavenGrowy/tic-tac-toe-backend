import {DynamoDB} from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({endpoint: "http://localhost:8000"});

export class Dynamo {
    async addUserToOnlineList(id, username) {
        const params = {
            TableName: "OnlineUsers",
            Item: {
                ID: {N: id},
                username: {S: username},
                heartbeat: {S: new Date().getTime()}
            },
        };
        await client.putItem(params).catch(e => console.log(e));
    }

    async fetchAllUsers() {
        const params = {
            TableName: "OnlineUsers",
        };
        const users = await client.scan(params).catch(e => console.log(e));
        return users.Items;
    }

    async deleteUsers() {
        const users = await this.fetchAllUsers();
        const now = new Date().getTime();
        const usersToDelete = users.filter(user=>(now - user.heartbeat.S) > 15000);

        let params = {RequestItems: {}};
        for (let i = 0; i < usersToDelete.length; i++) {
            params.RequestItems["OnlineUsers"] = [];
            params.RequestItems["OnlineUsers"].push({
                DeleteRequest: {
                    Key: {
                        ID: {N: usersToDelete[i].ID.N}
                    }
                }
            });
        }
        await client.batchWriteItem(params).catch(e => console.log(e));
    }

    async updateHeartbeat(id){
        const params = {
            TableName: "OnlineUsers",
            Key: {
                ID: {N: id}
            },
            UpdateExpression: "set heartbeat = :x",
            ExpressionAttributeValues: {
                ":x": {S: new Date().getTime()}
            }
        };
        await client.updateItem(params).catch(e => console.log(e));
    }
}



