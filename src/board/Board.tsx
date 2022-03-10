import { Stack } from '@mui/material'
import BoardCell from './BoardCell'

import { useBoardActions, useBoardState } from './hooks'
import { useGameStatus } from '../session/hooks'
import { GameStatus } from '../types'

const BOARD_SIZE = 800

function Board() {
  const actions = useBoardActions()
  const { cells, numOfCols } = useBoardState()
  const gameStatus = useGameStatus()

  if (!numOfCols) {
    return null
  }

  const width = BOARD_SIZE / numOfCols

  return (
    <Stack alignItems="center">
      <Stack
        direction="row"
        spacing={0}
        flexWrap="wrap"
        style={{ width: BOARD_SIZE }}
      >
        {cells.map((cell) => (
          <BoardCell
            key={`${cell.position.x}_${cell.position.y}`}
            cell={cell}
            width={width}
            height={width}
            disabled={gameStatus !== GameStatus.PLAYING}
            onReveal={(pos) => actions.openCell(pos)}
          />
        ))}
      </Stack>
    </Stack>
  )
}

export default Board
