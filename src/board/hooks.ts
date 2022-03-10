import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useAppSelector } from '../app/store'

import {
  openCell,
  refreshBoard,
  selectCells,
  selectBoardCols
} from './boardSlice'

export const useBoardActions = () => {
  const dispatch = useDispatch()

  return bindActionCreators({ openCell, refreshBoard }, dispatch)
}

export const useBoardState = () => {
  const cells = useAppSelector(selectCells)
  const numOfCols = useAppSelector(selectBoardCols)

  return { cells, numOfCols }
}
