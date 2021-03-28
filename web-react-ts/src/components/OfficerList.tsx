import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Paper, Grid, TextField, Button } from '@material-ui/core'

import Title from './Title'
import ForceGraph from './ForceGraph'

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
      height: '35em',
    },
    grid: {
      padding: '2em',
    },
  })

function OfficerList(props: any) {
  const { classes } = props
  const [searchState, setSearchState] = React.useState({
    first: '',
    second: '',
  })
  const [search, setSearch] = React.useState(false)

  const handleSearchChange = (key: string) => (event: any) => {
    const val = event.target.value

    setSearchState((oldState) => ({
      ...oldState,
      [key]: val,
    }))
  }

  const handleSearchSubmit = () => {
    if (
      !search &&
      searchState.first.length > 0 &&
      searchState.second.length > 0
    ) {
      setSearch(true)
    }
  }

  const resetSearch = () => setSearch(false)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper className={classes.grid}>
          <Title>Show Relation of 2 Officers</Title>
          <Grid item xs={12} md={6}>
            <TextField
              label="First Person"
              className={classes.textField}
              value={searchState.first}
              onChange={handleSearchChange('first')}
              margin="normal"
              variant="outlined"
              type="text"
              InputProps={{
                className: classes.input,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Second Person"
              className={classes.textField}
              value={searchState.second}
              onChange={handleSearchChange('second')}
              margin="normal"
              variant="outlined"
              type="text"
              InputProps={{
                className: classes.input,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              disabled={search}
              onClick={handleSearchSubmit}
            >
              Search
            </Button>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          {searchState.first.length > 0 && searchState.second.length > 0 && (
            <ForceGraph
              first={searchState.first}
              second={searchState.second}
              search={search}
              resetSearch={resetSearch}
            />
          )}
        </Paper>
      </Grid>
    </Grid>
  )
}

export default withStyles(styles)(OfficerList)
