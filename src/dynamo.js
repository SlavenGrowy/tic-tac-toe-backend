import {DynamoDB} from "@aws-sdk/client-dynamodb";
import {heartbeatInterval, tableName} from "./constants.js";

const client = new DynamoDB({endpoint: "http://localhost:8000"});

export class Dynamo {
    async addUserToOnlineList(id, username) {
        const params = {
            TableName: tableName,
            Item: {
                id: {S: id},
                username: {S: username},
                lastHeartbeat: {N: new Date().getTime()}
            },
        };
        await client.putItem(params)
    }

    async getOnlineUsers() {
        const params = {
            TableName: tableName,
        };
        const users = await client.scan(params).catch(e => console.log(e));
        return users.Items;
    }

    async deleteStaleUsers() {
        const users = await this.getOnlineUsers();
        const now = new Date().getTime();
        const userDeleteRequests = users.filter(user=>(now - user.lastHeartbeat.N) > heartbeatInterval)
            .map(user => ({
                DeleteRequest: {
                    Key: {
                        id: { S: user.id.S }
                    }
                }
            })
            );
        let params = { RequestItems: { OnlineUsers: userDeleteRequests } };
        await client.batchWriteItem(params).catch(e => console.log(e));
    }
}



