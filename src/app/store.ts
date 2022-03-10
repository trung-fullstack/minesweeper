import saga from 'redux-saga'
import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { all, fork } from 'redux-saga/effects'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { initGlobalSocket } from './socket'

import sessionReducer from '../session/sessionSlice'
import boardReducer from '../board/boardSlice'
import { watchSessionSaga } from '../session/sessionSaga'
import { watchBoardSaga } from '../board/boardSaga'

initGlobalSocket()

function* RootSaga() {
  yield all([fork(watchSessionSaga), fork(watchBoardSaga)])
}

const RootReducer = combineReducers({
  session: sessionReducer,
  board: boardReducer
})

const sagaMiddleware = saga()

export const store = configureStore({
  reducer: RootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(
      sagaMiddleware
    ),
  devTools: process.env.NODE_ENV !== 'production'
})

sagaMiddleware.run(RootSaga)

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
