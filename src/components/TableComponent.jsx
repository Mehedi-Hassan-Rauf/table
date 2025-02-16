import React, { useState, useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from '../components/ui/table' // Import your custom Table components

import { Button } from '../components/ui/button' // Assuming you're using these for pagination

// Function to fetch data from the API
const fetchData = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/comments') // Replace with your API endpoint
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

const TableComponent = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [rowsPerPage] = useState(30) // Max rows per page
  const [loading, setLoading] = useState(true) // To handle data loading state
  const [pageLoading, setPageLoading] = useState(false) // To handle pagination delay

  useEffect(() => {
    // Fetch data when the component mounts
    const getData = async () => {
      const fetchedData = await fetchData()
      setData(fetchedData)
      setLoading(false) // Set loading to false once data is fetched
    }

    getData()
  }, [])

  const handleChangePage = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(data.length / rowsPerPage)) return

    setPageLoading(true) // Show page loading indicator
    setTimeout(() => {
      setPage(newPage)
      setPageLoading(false) // Hide loading after 2 seconds
    }, 2000)
  }

  const startIndex = (page - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentPageData = data.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Comment</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pageLoading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
              <span className="text-gray-500">Loading page...</span>
            </TableCell>
          </TableRow>
        ) : (
          currentPageData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.body}</TableCell>
              <TableCell>{row.email}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>

      {/* Table Footer with Pagination */}
      <TableFooter>
        <TableRow>
          <TableCell colSpan={10}>
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 1 || pageLoading}
              >
                Previous
              </Button>
              <span>
                Page {page} of {Math.ceil(data.length / rowsPerPage)}
              </span>
              <Button
                onClick={() => handleChangePage(page + 1)}
                disabled={page === Math.ceil(data.length / rowsPerPage) || pageLoading}
              >
                Next
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default TableComponent
