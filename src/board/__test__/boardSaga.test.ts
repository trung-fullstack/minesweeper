import { END } from 'redux-saga'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import {
  onOpenCell,
  onGetMap,
  watchMapMessage,
  watchCellMessage,
  mapMessageChannel,
  cellMessageChannel
} from '../boardSaga'
import {
  openCell,
  refreshBoard,
  setCells,
  setNumOfCols,
  setNumOfRows
} from '../boardSlice'
import * as CommandApi from '../../app/commandApi'
import { setGameStatus } from '../../session/sessionSlice'
import { CellStatus, GameStatus } from '../../types'

describe('Board Saga', () => {
  it('should call sendOpenCell api', async () => {
    const sendOpenCellMock = jest
      .spyOn(CommandApi, 'sendOpenCell')
      .mockImplementation(() => {})

    await expectSaga(onOpenCell, openCell({ x: 1, y: 1 }))
      .call(CommandApi.sendOpenCell, 1, 1)
      .run()
    sendOpenCellMock.mockClear()
  })

  it('should call sendGetMap api', async () => {
    const sendGetMapMock = jest
      .spyOn(CommandApi, 'sendGetMap')
      .mockImplementation(() => {})

    await expectSaga(onGetMap).call(CommandApi.sendGetMap).run()
    sendGetMapMock.mockClear()
  })

  it('should watch map message and kill the game', async () => {
    const fakeChannel = {
      take() {},
      flush() {},
      close() {}
    }

    let count = 0
    await expectSaga(watchMapMessage)
      .provide([
        [matchers.call.fn(mapMessageChannel), fakeChannel],
        {
          take({ channel }, next) {
            if (channel === fakeChannel) {
              if (count === 0) {
                count += 1
                return 'You lose'
              } else {
                return END
              }
            }

            return next()
          }
        }
      ])
      .put(setGameStatus(GameStatus.LOST))
      .silentRun()
  })

  it('should watch map message and set game status', async () => {
    const fakeChannel = {
      take() {},
      flush() {},
      close() {}
    }

    let count = 0
    await expectSaga(watchMapMessage)
      .provide([
        [matchers.call.fn(mapMessageChannel), fakeChannel],
        {
          take({ channel }, next) {
            if (channel === fakeChannel) {
              if (count === 0) {
                count += 1
                return 'You won'
              } else {
                return END
              }
            }

            return next()
          }
        }
      ])
      .put(setGameStatus(GameStatus.WON))
      .silentRun()
  })

  it('should watch map message and initiate board', async () => {
    const fakeChannel = {
      take() {},
      flush() {},
      close() {}
    }
    let count = 0
    const message = '□□\n*1'
    const cells = [
      { position: { x: 0, y: 0 }, value: '□', status: CellStatus.Unknown },
      { position: { x: 1, y: 0 }, value: '□', status: CellStatus.Unknown },
      { position: { x: 0, y: 1 }, value: '*', status: CellStatus.Dead },
      { position: { x: 1, y: 1 }, value: '1', status: CellStatus.Revealed }
    ]
    await expectSaga(watchMapMessage)
      .provide([
        [matchers.call.fn(mapMessageChannel), fakeChannel],
        {
          take({ channel }, next) {
            if (channel === fakeChannel) {
              if (count === 0) {
                count += 1
                return message
              } else {
                return END
              }
            }
            return next()
          }
        }
      ])
      .put(setNumOfCols(2))
      .put(setNumOfRows(2))
      .put(setCells(cells))
      .silentRun()
  })

  it('should watch open cell message and set refresh board', async () => {
    const fakeChannel = {
      take() {},
      flush() {},
      close() {}
    }

    let count = 0
    await expectSaga(watchCellMessage)
      .provide([
        [matchers.call.fn(cellMessageChannel), fakeChannel],
        {
          take({ channel }, next) {
            if (channel === fakeChannel) {
              if (count === 0) {
                count += 1
                return 'You lose'
              } else {
                return END
              }
            }
            return next()
          }
        }
      ])
      .put(setGameStatus(GameStatus.LOST))
      .put(refreshBoard())
      .silentRun()
  })

  it('should watch open cell message and set game status', async () => {
    const fakeChannel = {
      take() {},
      flush() {},
      close() {}
    }

    let count = 0
    await expectSaga(watchCellMessage)
      .provide([
        [matchers.call.fn(cellMessageChannel), fakeChannel],
        {
          take({ channel }, next) {
            if (channel === fakeChannel) {
              if (count === 0) {
                count += 1
                return 'You won'
              } else {
                return END
              }
            }
            return next()
          }
        }
      ])
      .put(setGameStatus(GameStatus.WON))
      .put(refreshBoard())
      .silentRun()
  })

  it('should watch open cell message and kill game', async () => {
    const fakeChannel = {
      take() {},
      flush() {},
      close() {}
    }

    let count = 0
    await expectSaga(watchCellMessage)
      .provide([
        [matchers.call.fn(cellMessageChannel), fakeChannel],
        {
          take({ channel }, next) {
            if (channel === fakeChannel) {
              if (count === 0) {
                count += 1
                return 'Random'
              } else {
                return END
              }
            }
            return next()
          }
        }
      ])
      .put(setGameStatus(GameStatus.NONE))
      .put(refreshBoard())
      .silentRun()
  })
})
