import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { Cell, CellPosition } from '../types'
import { RootState } from '../app/store'

interface BoardState {
  cells: Cell[]
  numOfRows: number
  numOfCols: number
}

const initialState: BoardState = {
  cells: [],
  numOfRows: 0,
  numOfCols: 0
}

const boardSlice = createSlice({
  name: 'board',
  initialState: initialState,
  reducers: {
    openCell: (state, _: PayloadAction<CellPosition>) => {},
    setCells: (state, { payload }: PayloadAction<Array<Cell>>) => {
      state.cells = payload
    },
    refreshBoard: () => {},
    setNumOfRows: (state, { payload }: PayloadAction<number>) => {
      state.numOfRows = payload
    },
    setNumOfCols: (state, { payload }: PayloadAction<number>) => {
      state.numOfCols = payload
    }
  }
})

export const { openCell, setCells, refreshBoard, setNumOfCols, setNumOfRows } =
  boardSlice.actions

// Selector
export const selectCells = (state: RootState) => state.board.cells
export const selectBoardRows = (state: RootState) => state.board.numOfRows
export const selectBoardCols = (state: RootState) => state.board.numOfCols

export default boardSlice.reducer
