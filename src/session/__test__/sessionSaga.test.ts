import { END } from 'redux-saga'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import {
  onStartSession,
  watchNewMessage,
  newMessageChannel
} from '../sessionSaga'
import { startSession, setGameStatus } from '../sessionSlice'
import { refreshBoard } from '../../board/boardSlice'
import * as CommandApi from '../../app/commandApi'
import { GameLevel, GameStatus } from '../../types'

describe('Session Saga', () => {
  it('should call sendCreateNewSession api', async () => {
    const sendCreateNewSessionMock = jest
      .spyOn(CommandApi, 'sendCreateNewSession')
      .mockImplementation(() => {})

    await expectSaga(onStartSession, startSession(GameLevel.L1))
      .call(CommandApi.sendCreateNewSession, 1)
      .run()
    sendCreateNewSessionMock.mockClear()
  })

  it('should watch new message and set game status', async () => {
    const fakeChannel = {
      take() {},
      flush() {},
      close() {}
    }

    let count = 0
    await expectSaga(watchNewMessage)
      .provide([
        [matchers.call.fn(newMessageChannel), fakeChannel],
        {
          take() {
            if (count === 0) {
              count += 1
              return 'OK'
            } else {
              return END
            }
          }
        }
      ])
      .put(setGameStatus(GameStatus.PLAYING))
      .put(refreshBoard())
      .silentRun()
  })

  it('should watch new message and kill game', async () => {
    const fakeChannel = {
      take() {},
      flush() {},
      close() {}
    }

    let count = 0
    await expectSaga(watchNewMessage)
      .provide([
        [matchers.call.fn(newMessageChannel), fakeChannel],
        {
          take() {
            if (count === 0) {
              count += 1
              return 'random'
            } else {
              return END
            }
          }
        }
      ])
      .put(setGameStatus(GameStatus.NONE))
      .silentRun()
  })
})
