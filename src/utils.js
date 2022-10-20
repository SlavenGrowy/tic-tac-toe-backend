import { EMPTY } from './constants.js'
import { mockGameStateEventArgs } from './gameProtocol.js'

export const isInvalidMove = (game, playerId, position) => {
  const { board, playerTurn } = game
  return board[position] !== EMPTY || playerTurn !== playerId || isGameFinished(game)
}

const winningCases = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

export const isGameFinished = (game) => {
  return (
    winner(game, winningCases[0]) ||
    winner(game, winningCases[1]) ||
    winner(game, winningCases[2]) ||
    winner(game, winningCases[3]) ||
    winner(game, winningCases[4]) ||
    winner(game, winningCases[5]) ||
    winner(game, winningCases[6]) ||
    winner(game, winningCases[7]) ||
    stalemate(game)
  )
}

const winner = ({ players, board }, winningCaseIndexes) => {
  const [firstPlayer, secondPlayer] = players
  if (
    board[winningCaseIndexes[0]] === EMPTY ||
    board[winningCaseIndexes[0]] !== board[winningCaseIndexes[1]] ||
    board[winningCaseIndexes[0]] !== board[winningCaseIndexes[2]]
  )
    return false
  mockGameStateEventArgs.winner = firstPlayer.piece === board[winningCaseIndexes[0]] ? firstPlayer.id : secondPlayer.id
  return true
}

const stalemate = ({ board }) => {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === EMPTY) return false
  }
  return true
}
