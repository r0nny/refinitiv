import React from 'react'
// import { useTheme } from '@material-ui/core/styles'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { useQuery, gql } from '@apollo/client'

const GET_DATA_QUERY = gql`
  {
    popularJurisdiction(first: 10) {
      name
      count
    }
  }
`

export default function CountryRatings() {
  // const theme = useTheme()

  const { loading, error, data } = useQuery(GET_DATA_QUERY)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data.popularJurisdiction}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}
