import React, { useRef, useEffect } from 'react'
import {
  select,
  forceSimulation,
  forceManyBody,
  forceCollide,
  forceCenter,
  forceLink,
  scaleOrdinal,
  drag,
  schemeCategory10,
} from 'd3'
import { svgStyle } from '../utils/D3Utils'
import { IDimension, IGraph, INodes } from '../utils/interfaces'

var color = scaleOrdinal(schemeCategory10)

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
    // const zoomBehavior = zoom()
    //   .on('zoom', function (event: any) {
    //     const { transform } = event
    //     if (transform.k === 1) {
    //       transform.x = 0
    //       transform.y = 0
    //     }
    //     svg.attr('transform', transform)
    //   })
    //   .scaleExtent([1, 4])

    // svg.call(zoomBehavior)

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
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('g')

    const circles = node
      .append('circle')
      .attr('r', (d: any) => d.size + 20)
      .attr('fill', (d: any) => color(d.type))
      .call(
        drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
      )

    const label = node
      .append('text')
      .text((d: INodes) => (d.label ? d.label : d.id))
      .attr('fill', 'black')
      .attr('dx', -10)

    // draw simulation
    const simulation = forceSimulation()
      .force('charge', forceManyBody().strength(-500))
      .force('center', forceCenter(width / 2, height / 2))
      .force(
        'collide',
        forceCollide()
          .radius((d: any) => (d.size + 10) * -1)
          .iterations(2)
      )

    simulation.nodes(nodes).on('tick', () => {
      // update links
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      // update node
      circles
        .attr('cx', (d: any) => {
          return d.x
        })
        .attr('cy', (d: any) => d.y)

      // update text
      label.attr('x', (d: any) => d.x)
      label.attr('y', (d: any) => d.y)
    })

    simulation.force(
      'link',
      forceLink()
        .links(links)
        .id((d: any) => d.id)
        .distance(100)
        .strength(1)
    )

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
  }, [props.data])

  return <svg ref={svgRef} style={svgStyle}></svg>
}
