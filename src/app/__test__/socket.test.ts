import WS from 'jest-websocket-mock'
import { initGlobalSocket, getGlobalSocket, SocketCommand } from '../socket'

const API_URL = process.env.REACT_APP_API_URL || 'ws://localhost:8080'

describe('Without Socket ', () => {
  it('should throw error without intializing instance', () => {
    expect(getGlobalSocket).toThrowError('Socket is not initialized')
  })
})

describe('With Socket', () => {
  let server: WS
  beforeEach(async () => {
    server = new WS(API_URL)
    initGlobalSocket()
    await server.connected
  })
  afterEach(() => {
    WS.clean()
  })

  it('should be able retrieve socket instance', async () => {
    const socketInstance = getGlobalSocket()
    expect(socketInstance).toBeTruthy()
  })

  it('should be able to send messages to server', async () => {
    const socketInstance = getGlobalSocket()
    socketInstance.sendMessage('new: ok')
    await expect(server).toReceiveMessage('new: ok')
  })

  it('should be able to add listeners', () => {
    const socketInstance = getGlobalSocket()
    const callback = jest.fn((c) => {})
    const prevLength = socketInstance.getListeners(SocketCommand.NEW).length

    socketInstance.addListener(SocketCommand.NEW, callback)

    expect(socketInstance.getListeners(SocketCommand.NEW).length).toEqual(
      prevLength + 1
    )
  })

  it('should be able to remove listeners', () => {
    const socketInstance = getGlobalSocket()
    const callback = jest.fn((c) => {})
    expect(socketInstance.getListeners(SocketCommand.NEW).length).toEqual(0)
    const id = socketInstance.addListener(SocketCommand.NEW, callback)
    expect(socketInstance.getListeners(SocketCommand.NEW).length).toEqual(1)
    socketInstance.removeListner(SocketCommand.NEW, id)
    expect(socketInstance.getListeners(SocketCommand.NEW).length).toEqual(0)
  })

  it('should relay event to listners', () => {
    const socketInstance = getGlobalSocket()
    const callback = jest.fn((c) => {})
    socketInstance.addListener(SocketCommand.NEW, callback)
    server.send('new: ok')
    expect(callback.mock.calls.length).toBe(1)
  })

  it('should realy correctly formatted event to listners', () => {
    const socketInstance = getGlobalSocket()
    const callback = jest.fn((c) => {})
    socketInstance.addListener(SocketCommand.NEW, callback)
    server.send('new: ok')
    expect(callback.mock.calls[0][0]).toBe('ok')
  })

  it('should not relay event to other listners', () => {
    const socketInstance = getGlobalSocket()
    const callback = jest.fn((c) => {})
    socketInstance.addListener(SocketCommand.NEW, callback)
    server.send('random command: ok')
    expect(callback.mock.calls.length).toBe(0)
  })
})
