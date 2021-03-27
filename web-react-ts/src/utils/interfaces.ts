import { SimulationNodeDatum } from 'd3-force'

export interface StageProps {
  width: string | number
  height: string | number
  children?: React.ReactNode
}

export interface ZoomProps {
  children?: React.ReactNode
}

export interface SVGDatum {
  width: number
  height: number
  filterBrushEvent: boolean
}

export interface GroupDatum {
  byX: number
  byY: number
  byK: number
  toK: number
}

export interface INodes extends SimulationNodeDatum {
  id: string
  size: number
  group?: number
  type?: string
  label?: string
}

export interface ILinks {
  source: string
  target: string
  label?: string
}

export interface IGraph {
  nodes: INodes[]
  links: ILinks[]
}

export interface IDimension {
  width: number
  height: number
}

export interface IHealth {
  country: string
  hale: string
}

export interface IRating {
  name: string
  count: number
}
