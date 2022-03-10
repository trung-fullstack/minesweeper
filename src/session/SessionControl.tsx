import { useState } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

import { useSessionActions, useGameStatus } from './hooks'
import { GameLevel, GameStatus } from '../types'

function SessionControl() {
  const [level, setLevel] = useState(GameLevel.L1)
  const actions = useSessionActions()
  const gameStatus = useGameStatus()

  const handleChange = (event: SelectChangeEvent<number>) => {
    setLevel(event.target.value as number)
  }

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      p={2}
      justifyContent="center"
    >
      <Button
        disabled={gameStatus === GameStatus.PLAYING}
        variant="contained"
        onClick={() => actions.startSession(level)}
      >
        Start
      </Button>

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Level</InputLabel>
        <Select
          disabled={gameStatus === GameStatus.PLAYING}
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={level}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={GameLevel.L1}>1</MenuItem>
          <MenuItem value={GameLevel.L2}>2</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  )
}

export default SessionControl
