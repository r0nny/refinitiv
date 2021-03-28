import React, { useRef, useEffect } from 'react'
import { select, geoPath, geoMercator, scaleThreshold, schemeOranges } from 'd3'
import { svgStyle, worldData } from '../utils/D3Utils'
import { IDimension, IRating } from '../utils/interfaces'
import * as topojson from 'topojson-client'
import _ from 'lodash'

import { useQuery, gql } from '@apollo/client'
const GET_DATA_QUERY = gql`
  {
    popularOfficers(first: 200) {
      name
      count
    }
  }
`

const countries: any = topojson.feature(worldData, worldData.objects.countries)
const projection = geoMercator()
const pathGenerator = geoPath(projection)

export default function GeoMap() {
  const svgRef: any = useRef()

  const { loading, error, data: queryData } = useQuery(GET_DATA_QUERY)
  useEffect(() => {
    const svg: any = select(svgRef.current)
    const dimensions: IDimension = {
      width: svgRef.current.clientWidth,
      height: svgRef.current.clientHeight,
    }

    if (_.isEmpty(queryData) || !dimensions?.width || !dimensions?.height)
      return

    const { width, height } = dimensions

    const data: any = {}
    queryData.popularOfficers.forEach((val: IRating) => {
      if (!_.isEmpty(val.name)) {
        const keys = _.split(val.name, ';')
        if (!_.isEmpty(keys)) {
          keys.forEach((key) => (data[key] = (data[key] || 0) + val.count))
        }
      }
    })

    // console.log(`${_.keys(data).length} :  ${JSON.stringify(data)}`)
    const color = scaleThreshold<number, string>()
      .domain([100, 1000, 5000, 10000, 20000, 50000, 100000])
      .range(schemeOranges[7])
      .unknown('#ccc')

    svg.style('display', 'block').attr('viewBox', [0, 0, width, height])
    const defs = svg.append('defs')

    defs
      .append('path')
      .attr('id', 'outline')
      .attr('class', 'sphere')
      .attr('d', pathGenerator({ type: 'Sphere' }))

    defs.append('clipPath').attr('id', 'clip').append('use')

    const g = svg.append('g')

    g.append('g')
      .selectAll('path')
      .data(countries.features)
      .join('path')
      .attr('fill', (d: any) => color(data[d.properties.name]))
      .attr('d', pathGenerator)
      .append('title')
      .text((d: any) => `${d.properties.name}`)

    g.append('path')
      .datum(
        topojson.mesh(worldData, worldData.objects.countries, (a, b) => a !== b)
      )
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-linejoin', 'round')
      .attr('d', pathGenerator)

    svg.append('use').attr('fill', 'none').attr('stroke', 'black')
  }, [queryData])

  return (
    <>
      {loading && <p>Loading....</p>}
      {error && <p>Error !!!</p>}
      <svg ref={svgRef} style={svgStyle}></svg>
    </>
  )
}
