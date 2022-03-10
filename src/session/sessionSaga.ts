import { call, put, takeLatest, take, all, fork } from 'redux-saga/effects'
import { EventChannel } from 'redux-saga'

import { startSession, setGameStatus } from './sessionSlice'
import { refreshBoard } from '../board/boardSlice'
import {
  registerSessionMessageReceiver,
  deRegisterSessionMessageReceiver,
  createChannel
} from '../app/channel'
import { GameStatus } from '../types'
import * as CommandApi from '../app/commandApi'

// Channel receiver
export const newMessageChannel = createChannel(
  registerSessionMessageReceiver,
  deRegisterSessionMessageReceiver
)

/* 
  ------- Sagas -------------
*/

export function* onStartSession(action: ReturnType<typeof startSession>) {
  const { payload: level } = action
  yield call(CommandApi.sendCreateNewSession, level)
}

export function* watchNewMessage() {
  const chan: EventChannel<string> = yield call(newMessageChannel)
  try {
    while (true) {
      let content: string = yield take(chan)
      if (typeof content !== 'string') {
        continue
      }
      if (content === 'OK') {
        yield put(setGameStatus(GameStatus.PLAYING))
        yield put(refreshBoard())
      } else {
        yield put(setGameStatus(GameStatus.NONE))
      }
    }
  } finally {
  }
}

export function* watchSessionSaga() {
  yield all([
    takeLatest(startSession.type, onStartSession),
    fork(watchNewMessage)
  ])
}
