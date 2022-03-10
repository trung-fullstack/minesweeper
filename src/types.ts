export enum GameStatus {
  NONE = 'none',
  PLAYING = 'Playing',
  WON = 'Won',
  LOST = 'Lost'
}

export enum GameLevel {
  L1 = 1,
  L2 = 2,
  L3 = 3,
  L4 = 4
}

export interface CellPosition {
  x: number
  y: number
}

export enum CellStatus {
  Unknown,
  Dead,
  Revealed
}

export interface Cell {
  position: CellPosition
  value: string,
  status: CellStatus
}
