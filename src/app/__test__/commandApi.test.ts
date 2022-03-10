import WS from 'jest-websocket-mock'
import { initGlobalSocket } from '../socket'
import * as CommandApi from '../commandApi'
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

  it('should send new command to server', async () => {
    CommandApi.sendCreateNewSession(1)
    await expect(server).toReceiveMessage('new 1')
  })

  it('should send open command to server', async () => {
    CommandApi.sendOpenCell(1, 2)
    await expect(server).toReceiveMessage('open 1 2')
  })

  it('should send map command to server', async () => {
    CommandApi.sendGetMap()
    await expect(server).toReceiveMessage('map')
  })
})
