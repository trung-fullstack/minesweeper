/*

help      - returns valid commands
new L     - starts new session, L=1|2|3|4
map       - returns the current map
open X Y  - opens cell at X,Y coordinates

*/

export type MsgReceiverFunc = (msg: string) => void
export type EventListner = {
  id: number
  cmd: SocketCommand
  cb: MsgReceiverFunc
}
export enum SocketCommand {
  NEW = 'new',
  OPEN = 'open',
  BOARD = 'map'
}
export type SocketInstance = {
  sendMessage: (data: string) => void
  addListener: (cmd: SocketCommand, cb: MsgReceiverFunc) => number
  removeListner: (cmd: SocketCommand, idToRemove: number) => void
  getListeners: (cmd: SocketCommand) => EventListner[]
}

const API_URL = process.env.REACT_APP_API_URL || 'wss://localhost/game1'
let socketInstance: SocketInstance

function matchingSocketCommand(event: string): SocketCommand | undefined {
  if (event === SocketCommand.NEW) {
    return SocketCommand.NEW
  }

  if (event === SocketCommand.BOARD) {
    return SocketCommand.BOARD
  } else {
  }

  if (event === SocketCommand.OPEN) {
    return SocketCommand.OPEN
  }

  return
}

export function createSocketInstance(socketUrl: string): SocketInstance {
  let socket: WebSocket | undefined = new WebSocket(socketUrl)
  let messageListneres: {
    [SocketCommand.NEW]: EventListner[]
    [SocketCommand.OPEN]: EventListner[]
    [SocketCommand.BOARD]: EventListner[]
  } = {
    [SocketCommand.NEW]: [],
    [SocketCommand.OPEN]: [],
    [SocketCommand.BOARD]: []
  }

  socket.onmessage = function (event: MessageEvent<string>) {
    const { data } = event
    const pos = data.indexOf(':')
    const cmd = matchingSocketCommand(data.substring(0, pos))
    if (!cmd) {
      return
    }
    const content = data.substring(pos + 1)

    relayEvents(cmd, content.trim())
  }

  socket.onopen = function (event) {
    // do nothing
  }

  function addListener(cmd: SocketCommand, cb: MsgReceiverFunc) {
    const id = new Date().getTime()
    messageListneres[cmd] = [
      ...messageListneres[cmd],
      {
        id,
        cmd,
        cb
      }
    ]

    return id
  }

  function removeListner(cmd: SocketCommand, idToRemove: number) {
    messageListneres[cmd] = messageListneres[cmd].filter(
      ({ id }) => id !== idToRemove
    )
  }

  function relayEvents(cmd: SocketCommand, content: string) {
    messageListneres[cmd].forEach(({ cb }) => {
      cb(content)
    })
  }

  function sendMessage(data: string) {
    socket?.send(data)
  }

  function getListeners(cmd: SocketCommand): EventListner[] {
    return messageListneres[cmd]
  }

  return {
    sendMessage,
    addListener,
    removeListner,
    getListeners
  }
}

export function initGlobalSocket() {
  socketInstance = createSocketInstance(API_URL)
}

export function getGlobalSocket() {
  if (!socketInstance) {
    throw Error('Socket is not initialized')
  }

  return socketInstance
}
