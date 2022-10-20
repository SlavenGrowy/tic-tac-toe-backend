import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { EMPTY, GAME_STATUS, HEARTBEAT_INTERVAL, O, TABLE_GAMES, TABLE_ONLINE_USERS, X } from './constants.js'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
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

  async createGame(players) {
    const shuffledPlayers = players.sort(() => Math.random() - 0.5)

    const [first, second] = shuffledPlayers

    const playerOne = await this.getPlayerById(first)
    playerOne.piece = X
    const playerTwo = await this.getPlayerById(second)
    playerTwo.piece = O

    const params = {
      TableName: TABLE_GAMES,
      Item: marshall({
        id: crypto.randomUUID(),
        players: [playerOne, playerTwo],
        playerTurn: first,
        winner: null,
        state: STARTED,
        board: [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
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

    const userGames = regularGames.filter((game) => game.players.map((p) => p.id).includes(userId))
    const startedGames = userGames.filter((game) => game.state === STARTED)

    if (startedGames.length === 0) return null
    else return startedGames
  }

  async getGameById(id) {
    const params = {
      TableName: TABLE_GAMES,
      Key: marshall({ id })
    }
    return await client
      .getItem(params)
      .then((data) => unmarshall(data.Item))
      .catch((e) => console.error(e))
  }

  async updateGame(game) {
    const params = {
      TableName: TABLE_GAMES,
      Item: marshall({ id: game.id, ...game })
    }
    await client.putItem(params).catch((e) => console.error(e))
  }

  async getPlayerById(id) {
    const params = {
      TableName: TABLE_ONLINE_USERS,
      Key: marshall({ id })
    }
    return await client
      .getItem(params)
      .then((data) => unmarshall(data.Item))
      .catch((e) => console.error(e))
  }
}
