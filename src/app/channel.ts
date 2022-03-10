import { getGlobalSocket, SocketCommand, MsgReceiverFunc } from './socket'
import { eventChannel } from 'redux-saga'

export type RegisterFunc = (cb: MsgReceiverFunc) => number
export type DeRegisterFunc = (id: number) => void

export function registerSessionMessageReceiver(cb: MsgReceiverFunc) {
  return getGlobalSocket().addListener(SocketCommand.NEW, cb)
}

export function deRegisterSessionMessageReceiver(id: number) {
  getGlobalSocket().removeListner(SocketCommand.NEW, id)
}

export function registerOpenCellMessageReceiver(cb: MsgReceiverFunc) {
  return getGlobalSocket().addListener(SocketCommand.OPEN, cb)
}

export function deRegisterOpenCellMessageReceiver(id: number) {
  getGlobalSocket().removeListner(SocketCommand.OPEN, id)
}

export function registerMapMessageReceiver(cb: MsgReceiverFunc) {
  return getGlobalSocket().addListener(SocketCommand.BOARD, cb)
}

export function deRegisterMapMessageReceiver(id: number) {
  getGlobalSocket().removeListner(SocketCommand.BOARD, id)
}

// Channel receiver
export function createChannel(
  registerFunc: RegisterFunc,
  deRegisterFunc: DeRegisterFunc
) {
  return function receiveMessage() {
    return eventChannel<string>((emitter) => {
      const eventCallback = (content: string) => {
        emitter(content)
      }

      const subscribeId = registerFunc(eventCallback)

      return () => {
        deRegisterFunc(subscribeId)
      }
    })
  }
}
