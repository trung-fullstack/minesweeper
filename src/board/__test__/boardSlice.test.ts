import boardReducer, {
  setCells,
  setNumOfCols,
  setNumOfRows,
  refreshBoard,
  openCell
} from '../boardSlice'
import { CellStatus } from '../../types'

describe('Board Slice', () => {
  it('setNumOfRows', () => {
    const state = boardReducer(
      {
        cells: [],
        numOfRows: 0,
        numOfCols: 0
      },
      setNumOfRows(1)
    )
    expect(state.numOfRows).toEqual(1)
  })

  it('setNumOfCols', () => {
    const state = boardReducer(
      {
        cells: [],
        numOfRows: 0,
        numOfCols: 0
      },
      setNumOfCols(1)
    )
    expect(state.numOfCols).toEqual(1)
  })

  it('setCells', () => {
    const cells = [
      { position: { x: 0, y: 0 }, value: '□', status: CellStatus.Unknown },
      { position: { x: 1, y: 0 }, value: '□', status: CellStatus.Unknown },
      { position: { x: 0, y: 1 }, value: '*', status: CellStatus.Dead },
      { position: { x: 1, y: 1 }, value: '1', status: CellStatus.Revealed }
    ]

    const state = boardReducer(
      {
        cells: [],
        numOfRows: 0,
        numOfCols: 0
      },
      setCells(cells)
    )
    expect(state.cells.length).toEqual(cells.length)
  })

  it('refreshBoard', () => {
    const state = boardReducer(
      {
        cells: [],
        numOfRows: 0,
        numOfCols: 0
      },
      refreshBoard()
    )
    expect(state.cells.length).toEqual(0)
    expect(state.numOfRows).toEqual(0)
    expect(state.numOfCols).toEqual(0)
  })

  it('openCell', () => {
    const state = boardReducer(
      {
        cells: [],
        numOfRows: 0,
        numOfCols: 0
      },
      openCell({ x: 1, y: 1 })
    )
    expect(state.cells.length).toEqual(0)
    expect(state.numOfRows).toEqual(0)
    expect(state.numOfCols).toEqual(0)
  })
})
