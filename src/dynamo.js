import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { heartbeatInterval, tableName } from './constants.js'
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb"

const client = new DynamoDB({ endpoint: 'http://localhost:8000' })

export class Dynamo {
  async addUserToOnlineList(id, username) {
    const params = {
      TableName: tableName,
      Item: marshall({
        id: id,
        username: username ,
        lastHeartbeat: new Date().getTime() })
      }
    await client.putItem(params)
  }

  async getOnlineUsers() {
    const params = {
      TableName: tableName
    }
    const users = await client.scan(params).catch((e) => console.log(e))
    return users.Items.map(user => unmarshall(user))
  }

  async deleteStaleUsers() {
    const users = await this.getOnlineUsers()
    const now = new Date().getTime()
    const userDeleteRequests = users
      .filter((user) => now - user.lastHeartbeat > heartbeatInterval)
      .map((user) => ({
        DeleteRequest: {
          Key: marshall({
            id: user.id
          })
        }
      }))

    if (!userDeleteRequests.length) {
      console.log('No stale users to delete')
      return
    }

    console.log(`Deleting ${userDeleteRequests.length} users`)
    let params = { RequestItems: { OnlineUsers: userDeleteRequests } }
    await client.batchWriteItem(params).catch((e) => console.error('Error while deleting stale users', e))
  }
}