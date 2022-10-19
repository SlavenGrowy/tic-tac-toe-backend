import { EMPTY } from './constants.js'

export const isValidMove = (game, playerId, position) => {
  const { board, playerTurn } = game
  return (board[position] === EMPTY && playerTurn === playerId);
}