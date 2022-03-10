import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { GameStatus, GameLevel } from '../types'
import { RootState } from '../app/store'

interface SessionState {
  level: GameLevel
  status: GameStatus
}

const initialState: SessionState = {
  level: GameLevel.L1,
  status: GameStatus.NONE
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {
    startSession: (state, { payload }: PayloadAction<GameLevel>) => {
      state.level = payload
    },
    setGameStatus: (state, { payload }: PayloadAction<GameStatus>) => {
      state.status = payload
    }
  }
})

export const { startSession, setGameStatus } =
  sessionSlice.actions

// Selector

export const selectGameLevel = (state: RootState) => state.session.level
export const selectGameStatus = (state: RootState) => state.session.status

export default sessionSlice.reducer
