import {DynamoDB} from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({endpoint: "http://localhost:8000"});
const tableName = "OnlineUsers";

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
        await client.putItem(params).catch(e => console.log(e));
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
        const heartbeatInterval = 15 * 1000;
        const now = new Date().getTime();
        const userDeleteRequests = users.filter(user=>(now - user.lastHeartbeat.S) > heartbeatInterval)
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

    async updateUserHeartbeat(userId){
        const params = {
            TableName: tableName,
            Key: {
                id: {S: userId}
            },
            UpdateExpression: "set lastHeartbeat = :x",
            ExpressionAttributeValues: {
                ":x": {N: new Date().getTime()}
            }
        };
        await client.updateItem(params).catch(e => console.log(e));
    }
}



