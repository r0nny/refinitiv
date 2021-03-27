import React, { useRef, useEffect } from 'react'
import {
  select,
  geoPath,
  scaleSequential,
  interpolateYlGnBu,
  geoMercator,
} from 'd3'
import { svgStyle, worldData } from '../utils/D3Utils'
import { IDimension, IRating } from '../utils/interfaces'
import * as topojson from 'topojson-client'
import _ from 'lodash'

import { useQuery, gql } from '@apollo/client'
const GET_DATA_QUERY = gql`
  {
    popularOfficers(first: 500) {
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
  // will be called initially and on every data change
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

    console.log(`${_.keys(data).length} :  ${JSON.stringify(data)}`)
    const color = scaleSequential()
      .domain(_.values(data))
      .interpolator(interpolateYlGnBu)
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
      .attr('fill', (d: any) => {
        if (!data[d.properties.name]) {
          console.log('Missing: ', d.properties.name)
        }
        return color(data[d.properties.name])
      })
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
