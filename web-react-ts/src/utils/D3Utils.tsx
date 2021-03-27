import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { IGraph, StageProps, SVGDatum, ZoomProps } from './interfaces'
import _ from 'lodash'

const SVGContext = React.createContext(null)

export const circleData: number[] = [20, 40, 30, 50, 70, 30]

export const graphData: IGraph = {
  nodes: [
    { id: 'Alice', size: 10 },
    { id: 'Bob', size: 20 },
    { id: 'Carol', size: 40 },
    { id: 'Dave', size: 20 },
  ],
  links: [
    { source: 'Alice', target: 'Bob' },
    { source: 'Bob', target: 'Carol' },
    { source: 'Dave', target: 'Carol' },
  ],
}

export const svgStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: 'white',
}

export function Stage({ width, height, children }: StageProps) {
  const svgRef = useRef(null)
  const [svg, setSvg] = useState(null)

  useEffect(() => setSvg(svgRef.current), [])

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ backgroundColor: 'lightgray' }}
    >
      <SVGContext.Provider value={svg}>{children}</SVGContext.Provider>
    </svg>
  )
}

export function useSvg() {
  return React.useContext(SVGContext)
}

export function ZoomContainer({ children }: ZoomProps) {
  const svgElement: any = useSvg()
  const [{ x, y, k }, setTransform] = useState({ x: 0, y: 0, k: 1 })

  useEffect(() => {
    if (_.isEmpty(svgElement)) return

    const width = svgElement?.clientWidth
    const height = svgElement?.clientHeight
    const selection = d3.select(svgElement)
    const zoom:
      | ((this: SVGRectElement, event: any, datum: SVGDatum) => void)
      | undefined = d3
      .zoom()
      .on('zoom', function (d3event) {
        setTransform(d3event.transform)
      })
      .scaleExtent([1, 10])

    const simulation: any = d3
      .forceSimulation()
      .force(
        'link',
        d3.forceLink().id((node: any) => node?.id)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))
    simulation.stop()

    selection.call(zoom)
    return function () {
      selection.on('.zoom', null)
    }
  }, [svgElement])

  return <g transform={`translate(${x}, ${y}) scale(${k})`}>{children}</g>
}
