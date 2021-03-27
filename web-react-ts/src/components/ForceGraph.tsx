import React, { useRef, useEffect } from 'react'
import {
  select,
  zoom,
  forceSimulation,
  forceManyBody,
  forceCollide,
  forceCenter,
  forceLink,
  scaleOrdinal,
  drag,
} from 'd3'
import { svgStyle } from '../utils/D3Utils'
import { IDimension, IGraph, INodes } from '../utils/interfaces'

var color = scaleOrdinal([
  '#66c2a5',
  '#fc8d62',
  '#8da0cb',
  '#e78ac3',
  '#a6d854',
  '#ffd92f',
  '#e5c494',
  '#b3b3b3',
])

interface ForceGrapProps {
  data: IGraph
}

export default function ForceGraph(props: ForceGrapProps) {
  const svgRef: any = useRef()

  // will be called initially and on every data change
  useEffect(() => {
    const svg: any = select(svgRef.current)
    const dimensions: IDimension = {
      width: svgRef.current.clientWidth,
      height: svgRef.current.clientHeight,
    }

    if (!dimensions?.width || !dimensions?.height) return

    // add zoom capability
    const zoomBehavior = zoom()
      .on('zoom', function (event: any) {
        const { transform } = event
        if (transform.k === 1) {
          transform.x = 0
          transform.y = 0
        }
        svg.attr('transform', transform)
      })
      .scaleExtent([1, 2])

    svg.call(zoomBehavior)

    const { width, height } = dimensions
    const { nodes, links } = props.data

    // draw links
    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')

    // draw nodes
    const node = svg
      .append('g')
      .attr('class', 'node')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', (d: any) => d.size + 20)
      .attr('fill', (d: any) => color(d.id))
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)

    const label = svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('fill', 'black')
      .attr('x', (d: any) => d.x)
      .attr('y', (d: any) => d.y)
      .text((d: INodes) => (d.label ? d.label : d.id))

    node.call(
      drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
    )

    // draw simulation
    const simulation = forceSimulation(nodes)
      .force('charge', forceManyBody().strength(30))
      .force('center', forceCenter(width / 2, height / 2))
      .force(
        'collision',
        forceCollide()
          .strength(0.5)
          .radius(() => 25)
      )
      .force(
        'link',
        forceLink()
          .links(links)
          .id((d: any) => d.id)
          .distance(150)
          .strength(5)
      )

    simulation.on('tick', () => {
      // update links
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      // update node
      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y)

      // update text
      label.attr('x', (d: any) => {
        console.log(JSON.stringify(d))
        return d.x
      })
      label.attr('y', (d: any) => d.y)
      label.attr('dx', (d: any) => -1 * d.size)
    })

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.03).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.03)
      d.fx = null
      d.fy = null
    }
    // const simulation = forceSimulation(nodeData)
    //   .force(
    //     'link',
    //     forceLink(linkData)
    //       .id((d: any) => d.id)
    //       .distance(30)
    //       .strength(1)
    //   )
    //   .force('charge', forceManyBody().strength(-50))
    //   .force('collide', forceCollide(30))
    // const simulation = forceSimulation()
    //   .force(
    //     'forceX',
    //     forceX()
    //       .strength(0.1)
    //       .x(width * 0.5)
    //   )
    //   .force(
    //     'forceY',
    //     forceY()
    //       .strength(0.1)
    //       .y(height * 0.5)
    //   )
    //   .force(
    //     'center',
    //     forceCenter()
    //       .x(width * 0.5)
    //       .y(height * 0.5)
    //   )
    //   .force('charge', forceManyBody().strength(-15))
    //   .stop()
  }, [])

  return <svg ref={svgRef} style={svgStyle}></svg>
}
