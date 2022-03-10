import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import { Cell, CellPosition, CellStatus } from '../types'

interface BoardCellProps {
  cell: Cell
  onReveal: (pos: CellPosition) => void
  disabled?: boolean
  width?: number
  height?: number
}

function BoardCell({
  cell: { position, value, status },
  onReveal,
  disabled = false,
  width = 50,
  height = 50
}: BoardCellProps) {
  if (status === CellStatus.Unknown) {
    return (
      <Button
        color="secondary"
        disabled={disabled}
        variant="contained"
        sx={{
          width,
          height,
          border: 0,
          borderRadius: 0,
          maxWidth: width,
          minWidth: width,
          minHeight: height,
          maxHeight: height,
          padding: 0
        }}
        onClick={() => {
          onReveal(position)
        }}
      />
    )
  }

  return (
    <Box
      sx={{
        width,
        height,
        color: status === CellStatus.Dead ? 'red' : 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {value}
    </Box>
  )
}

export default BoardCell
