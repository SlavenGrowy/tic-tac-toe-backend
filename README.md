# Tic-Tac-Toe Backend

## Architecture (FE/BE)

The project's architecture is documented, under `architecture.drawio`. The file can be opened,
via [draw.io](https://app.diagrams.net/), or via
the [draw.io intellij plugin](https://plugins.jetbrains.com/plugin/15635-diagrams-net-integration)

⚠️ **Any architectural changes need to be reflected in this file and committed!** ⚠️

## Game Protocol

```js
const X = 1
const O = 0
const EMPTY = 9

const mockGameStateEventArgs = {
  id: '',
  players: [
    { id: '', username: '', piece: X },
    { id: '', username: '', piece: O }
  ],
  playerTurn: '',
  winner: null,
  state: GAME_STATUS.STARTED,
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

const mockMovePlayedEventArgs = {
  gameId: '',
  playerId: '',
  move: { piece: X, position: 5 }
}
```

## TODO

- [ ] Document installation
- [ ] Document running
