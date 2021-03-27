import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import ForceGraph from './ForceGraph'
// import { select } from 'd3-selection'
import { graphData } from '../utils/D3Utils'
import GeoMap from './GeoMap'
import CountryRatings from './CountryRatings'

export default function Dashboard() {
  const theme = useTheme()
  // const svgRef: any = useRef()
  // console.log('SVGRef: ', svgRef)

  // useEffect(() => {
  //   console.log('SVGRef: ', svgRef)
  //   const svg: any = select(svgRef?.current)
  //   svg
  //     .selectAll('circle')
  //     .data(circleData)
  //     .join('circle')
  //     .attr('r', (value: number) => value)
  //     .attr('cx', (value: number) => value * 2)
  //     .attr('cy', (value: number) => value * 2)
  //     .attr('fill', 'blue')
  // }, [])

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: '35em',
    },
  }))
  const classes = useStyles(theme)
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <CountryRatings />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <GeoMap />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <ForceGraph data={graphData} />
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
