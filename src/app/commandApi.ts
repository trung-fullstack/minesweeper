import { getGlobalSocket, SocketCommand } from './socket'

export function sendCreateNewSession(level: 1 | 2 | 3 | 4) {
  getGlobalSocket().sendMessage(`${SocketCommand.NEW} ${level}`)
}

export function sendOpenCell(x: number, y: number) {
  getGlobalSocket().sendMessage(`${SocketCommand.OPEN} ${x} ${y}`)
}

export function sendGetMap() {
  getGlobalSocket().sendMessage(`${SocketCommand.BOARD}`)
}
