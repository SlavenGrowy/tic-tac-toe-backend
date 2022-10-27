# Tic-Tac-Toe Backend

## Architecture (FE/BE)

The project's architecture is documented, under `architecture.drawio`. The file can be opened,
via [draw.io](https://app.diagrams.net/), or via
the [draw.io intellij plugin](https://plugins.jetbrains.com/plugin/15635-diagrams-net-integration)

⚠️ **Any architectural changes need to be reflected in this file and committed!** ⚠️

## Game Protocol

All gameplay information, is exchanged in [Socket.io Rooms](https://socket.io/docs/v3/rooms/), 
using [Socket.io Event](https://socket.io/docs/v3/emitting-events/). 
And the data passed in these events needs to conform to the following protocol:

```js
const X = 1
const O = 0
const EMPTY = 9
```

#### Event GAME_STATE

Sent by **server** listened to by **clients**

```js
const mockGameStateEventArgs = {
  id: '',
  players: [
    { id: '', username: '', piece: X },
    { id: '', username: '', piece: O }
  ],
  playerTurn: '',
  winner: null, 
  // Field 'winner' can be either null or have a player's id. 
  // A null value would signify a stalemate.
  state: GAME_STATUS.STARTED | GAME_STATUS.FINISHED,
  board: [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
}

// For simplicity the board is going to be a number array,
// indicating the board state.
//
//   0 | 1 | 2
// -------------
//   3 | 4 | 5
// -------------
//   6 | 7 | 8
```

A client receives a **GAME_STATE** event when it initially connects to a game room, 
and after a move is played.

When a client receives a **GAME_STATE** event, it needs to update the UI accordingly.

#### Event MOVE_PLAYED

Sent by **clients** listened to by **server**

```js
const mockMovePlayedEventArgs = {
  gameId: '',
  playerId: '',
  move: { piece: X, position: 5 }
}
```

A server receives a **MOVE_PLAYED** event when a player plays a move.

When the server receives a **MOVE_PLAYED**,
it updates the game state and sends out a **GAME_STATE** to the Game Room

## TODO

- [ ] Document installation
- [ ] Document running
