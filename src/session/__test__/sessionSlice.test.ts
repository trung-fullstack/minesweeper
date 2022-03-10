import sessionReducer, { startSession, setGameStatus } from '../sessionSlice'
import { GameLevel, GameStatus } from '../../types'

describe('Board Slice', () => {
  it('startSession', () => {
    const newState = sessionReducer(
      {
        level: GameLevel.L1,
        status: GameStatus.NONE
      },
      startSession(GameLevel.L1)
    )

    expect(newState.level).toEqual(GameLevel.L1)
  })

  it('setGameStatus', () => {
    const newState = sessionReducer(
      {
        level: GameLevel.L1,
        status: GameStatus.NONE
      },
      setGameStatus(GameStatus.LOST)
    )
    expect(newState.status).toEqual(GameStatus.LOST)
  })
})
