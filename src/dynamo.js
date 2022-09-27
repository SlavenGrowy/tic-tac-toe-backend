import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { gameState, heartbeatInterval, tableGames, tableOnlineUsers } from './constants.js'
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb'
import crypto from 'crypto'

const client = new DynamoDB({ endpoint: 'http://localhost:8000' })
const { STARTED, FINISHED } = gameState

export class Dynamo {
  async addUserToOnlineList(id, username) {
    const params = {
      TableName: tableOnlineUsers,
      Item: marshall({
        id: id,
        username: username,
        lastHeartbeat: new Date().getTime()
      })
    }
    await client.putItem(params)
  }

  async getOnlineUsers() {
    const params = {
      TableName: tableOnlineUsers
    }
    const users = await client.scan(params).catch((e) => console.error(e))
    return users.Items.map((user) => unmarshall(user))
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

  async createGame(participants) {
    const id = crypto.randomUUID()
    const params = {
      TableName: tableGames,
      Item: marshall({
        id: id,
        participants: participants,
        playerTurn: participants[Math.round(Math.random())],
        state: STARTED
      })
    }
    await client.putItem(params)
  }

  async getStartedGames(userId) {
    const params = {
      TableName: tableGames
    }
    const games = await client.scan(params).catch((e) => console.error(e))
    const regularGames = games?.Items?.map((game) => unmarshall(game))

    if (regularGames.length === 0) return null

    const userGames = regularGames.filter((game) => game.participants.includes(userId))
    return userGames.filter((game) => game.state === 'STARTED')
  }
}
