import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { tableGames, tableOnlineUsers } from './src/constants.js'

const { NODE_ENV, SETUP_DB = false } = process.env

if (!SETUP_DB) throw new Error("To init the database, you must set the 'SETUP_DB' env variable to 'true'!")

if (NODE_ENV === 'production') throw new Error('The database should not be initialized in production!')

const client = new DynamoDB({ endpoint: 'http://localhost:8000' })

const onlineUsersParams = {
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
  TableName: tableOnlineUsers
}
await client.createTable(onlineUsersParams).catch((err) => console.log(err))

const gamesParams = {
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
  TableName: tableGames
}
await client.createTable(gamesParams).catch((err) => console.log(err))
