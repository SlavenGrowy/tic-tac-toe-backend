import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { GAME_STATUS, HEARTBEAT_INTERVAL, TABLE_GAMES, TABLE_ONLINE_USERS } from './constants.js'
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb'
import crypto from 'crypto'

const client = new DynamoDB({ endpoint: 'http://localhost:8000' })
const { STARTED } = GAME_STATUS

export class Dynamo {
  async addUserToOnlineList(id, username) {
    const params = {
      TableName: TABLE_ONLINE_USERS,
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
      TableName: TABLE_ONLINE_USERS
    }
    const users = await client.scan(params).catch((e) => console.error(e))
    return users.Items.map((user) => unmarshall(user))
  }

  async deleteStaleUsers() {
    const users = await this.getOnlineUsers()
    const now = new Date().getTime()
    const userDeleteRequests = users
      .filter((user) => now - user.lastHeartbeat > HEARTBEAT_INTERVAL)
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
      TableName: TABLE_GAMES,
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
      TableName: TABLE_GAMES
    }
    const games = await client.scan(params).catch((e) => console.error(e))
    const regularGames = games?.Items?.map((game) => unmarshall(game))

    if (!regularGames) return null

    const userGames = regularGames.filter((game) => game.participants.includes(userId))
    const startedGames = userGames.filter((game) => game.state === 'STARTED')

    if (startedGames.length === 0) return null
    else return startedGames
  }
}
