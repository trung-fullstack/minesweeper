import WS from 'jest-websocket-mock'
import { initGlobalSocket, getGlobalSocket, SocketCommand } from '../socket'
import {
  registerSessionMessageReceiver,
  registerOpenCellMessageReceiver,
  registerMapMessageReceiver,
  deRegisterSessionMessageReceiver,
  deRegisterOpenCellMessageReceiver,
  deRegisterMapMessageReceiver,
  createChannel
} from '../channel'
const API_URL = process.env.REACT_APP_API_URL || 'ws://localhost:8080'
describe('Lib', () => {
  let server: WS
  beforeEach(async () => {
    server = new WS(API_URL)
    initGlobalSocket()
    await server.connected
  })
  afterEach(() => {
    WS.clean()
  })

  it('should be able to add / remove "new" command listeners', () => {
    const callback = jest.fn((c) => {})
    const id = registerSessionMessageReceiver(callback)
    server.send('new: ok')
    expect(callback.mock.calls.length).toBe(1)
    deRegisterSessionMessageReceiver(id)
    server.send('new: ok')
    expect(callback.mock.calls.length).toBe(1)
  })

  it('should be able to add / remove "map" command listeners', () => {
    const callback = jest.fn((c) => {})
    const id = registerMapMessageReceiver(callback)
    server.send('map: □□□')
    expect(callback.mock.calls.length).toBe(1)
    deRegisterMapMessageReceiver(id)
    server.send('map: □□□')
    expect(callback.mock.calls.length).toBe(1)
  })

  it('should be able to add / remove "recieve" command listeners', () => {
    const callback = jest.fn((c) => {})
    const id = registerOpenCellMessageReceiver(callback)
    server.send('open: ok')
    expect(callback.mock.calls.length).toBe(1)
    deRegisterOpenCellMessageReceiver(id)
    server.send('open: ok')
    expect(callback.mock.calls.length).toBe(1)
  })

  it('should create channel receiver', () => {
    const mapMessageChannel = createChannel(
      registerMapMessageReceiver,
      deRegisterMapMessageReceiver
    )

    const channel = mapMessageChannel()
    const socketInstance = getGlobalSocket()
    expect(socketInstance.getListeners(SocketCommand.BOARD).length).toEqual(1)
    expect(channel.close).toBeTruthy()
    channel.close()
    expect(socketInstance.getListeners(SocketCommand.BOARD).length).toEqual(0)
  })
})
