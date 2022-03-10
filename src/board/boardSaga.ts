import { put, takeLatest, all, fork, call, take } from 'redux-saga/effects'
import { EventChannel } from 'redux-saga'
import {
  openCell,
  setCells,
  refreshBoard,
  setNumOfCols,
  setNumOfRows
} from './boardSlice'
import { setGameStatus } from '../session/sessionSlice'
import {
  registerMapMessageReceiver,
  deRegisterMapMessageReceiver,
  registerOpenCellMessageReceiver,
  deRegisterOpenCellMessageReceiver,
  createChannel
} from '../app/channel'
import { GameStatus, CellStatus } from '../types'
import * as CommandApi from '../app/commandApi'

function getCellStatus(value: string) {
  if (value === '*') {
    return CellStatus.Dead
  }

  if (value === '□') {
    return CellStatus.Unknown
  }

  return CellStatus.Revealed
}

// Channel receiver
export const mapMessageChannel = createChannel(
  registerMapMessageReceiver,
  deRegisterMapMessageReceiver
)

export const cellMessageChannel = createChannel(
  registerOpenCellMessageReceiver,
  deRegisterOpenCellMessageReceiver
)

/* 
  ------- Sagas -------------
*/

export function* onOpenCell(action: ReturnType<typeof openCell>) {
  const {
    payload: { x, y }
  } = action

  yield call(CommandApi.sendOpenCell, x, y)
}

export function* onGetMap() {
  yield call(CommandApi.sendGetMap)
}

export function* watchMapMessage() {
  const chan: EventChannel<string> = yield call(mapMessageChannel)
  try {
    while (true) {
      let content: string = yield take(chan)
      if (typeof content !== 'string') {
        continue
      }
      if (content === 'You lose') {
        yield put(setGameStatus(GameStatus.LOST))
      } else if (content === 'You won') {
        yield put(setGameStatus(GameStatus.WON))
      } else {
        const rows = content.split('\n')
        const cols = rows[0].split('')

        yield put(setNumOfRows(rows.length))
        yield put(setNumOfCols(cols.length))

        const cells = rows.flatMap((row, y) =>
          row.split('').map((value, x) => ({
            position: { x, y },
            value,
            status: getCellStatus(value)
          }))
        )
        yield put(setCells(cells))
      }
    }
  } finally {
  }
}

export function* watchCellMessage() {
  const chan: EventChannel<string> = yield call(cellMessageChannel)
  try {
    while (true) {
      let content: string = yield take(chan)
      if (typeof content !== 'string') {
        continue
      }

      if (content === 'You lose') {
        yield put(setGameStatus(GameStatus.LOST))
      } else if (content === 'You won') {
        yield put(setGameStatus(GameStatus.WON))
      } else if (content !== 'OK') {
        yield put(setGameStatus(GameStatus.NONE))
      }
      yield put(refreshBoard())
    }
  } finally {
  }
}

export function* watchBoardSaga() {
  yield all([
    takeLatest(openCell.type, onOpenCell),
    takeLatest(refreshBoard.type, onGetMap),
    fork(watchMapMessage),
    fork(watchCellMessage)
  ])
}
