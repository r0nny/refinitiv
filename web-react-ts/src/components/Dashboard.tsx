import React, { useEffect, useRef } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import RecentReviews from './RecentReviews'
import CountryRatings from './CountryRatings'
import Circle from './Circle'
import ForceGraph from './ForceGraph'
import { select } from 'd3-selection'
import { circleData, graphData, svgStyle } from '../utils/D3Utils'

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
        {/* Ratings Chart */}
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <CountryRatings />
          </Paper>
        </Grid>
        {/* User Count */}
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <ForceGraph data={graphData} />
          </Paper>
          {/* <Paper className={fixedHeightPaper}>
            <Circle data={[1, 2, 3]} />
          </Paper> */}
        </Grid>
        {/* Recent Reviews */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <RecentReviews />
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
