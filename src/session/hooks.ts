import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import { useAppSelector } from '../app/store'
import { selectGameStatus, startSession } from './sessionSlice'

export const useSessionActions = () => {
  const dispatch = useDispatch()

  return bindActionCreators({ startSession }, dispatch)
}

export const useGameStatus = () => {
  const gameStatus = useAppSelector(selectGameStatus)

  return gameStatus
}
