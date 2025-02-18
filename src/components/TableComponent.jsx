import React, { useState, useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from '../components/ui/table'

import { Button } from '../components/ui/button'

// Function to fetch data from the API
const fetchData = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/comments')
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
  const totalPages = Math.ceil(data.length / rowsPerPage)

  useEffect(() => {
    const getData = async () => {
      const fetchedData = await fetchData()
      setData(fetchedData)
      setLoading(false) // Set loading to false once data is fetched
    }

    getData()
  }, [])

  const handleChangePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages || pageLoading) return

    setPageLoading(true) // Show page loading indicator
    setTimeout(() => {
      setPage(newPage)
      setPageLoading(false) // Hide loading after 2 seconds
    }, 2000)
  }

  const startIndex = (page - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentPageData = data.slice(startIndex, endIndex)

  const renderPagination = () => {
    let pageNumbers = []
    const maxButtons = 5 // Max buttons to show at a time

    if (totalPages <= maxButtons) {
      pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    } else {
      if (page <= 3) {
        pageNumbers = [1, 2, 3, '...', totalPages]
      } else if (page >= totalPages - 2) {
        pageNumbers = [1, '...', totalPages - 2, totalPages - 1, totalPages]
      } else {
        pageNumbers = [1, '...', page - 1, page, page + 1, '...', totalPages]
      }
    }

    return pageNumbers.map((num, index) =>
      num === '...' ? (
        <span key={index} className="px-2">
          ...
        </span>
      ) : (
        <Button
          key={index}
          onClick={() => handleChangePage(num)}
          // disabled={num === page || pageLoading}
          className={`px-3 py-1 hover:bg-cyan-700 max-sm:text-[10px] max-sm:px-2 ${
            num === page ? 'bg-cyan-700 text-white cursor-none' : 'bg-gray-200 text-black hover:text-white'
          }`}
        >
          {num}
        </Button>
      )
    )
  }

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
          <div className="flex justify-end mt-10 gap-2">
            <Button 
              className="bg-white hover:bg-[#64439A] hover:text-white text-black font-bold border border-gray-400" 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>

            {/* First 3 Pages */}
            {[...Array(Math.min(3, totalPages))].map((_, i) => (
              <Button 
                key={i} 
                className={`hover:bg-[#64439A] ${page === i + 1 ? 'bg-[#64439A] text-white' : 'bg-white text-black hover:text-white border border-gray-400'} font-bold`} 
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            {/* Ellipsis if more pages exist */}
            {totalPages > 4 && (
              <span className="px-2 text-gray-500">...</span>
            )}

            {/* Last Page */}
            {totalPages > 3 && (
              <Button 
                className={`hover:bg-[#64439A] ${page === totalPages ? 'bg-[#64439A] text-white' : 'bg-white text-black hover:text-white border border-gray-400'} font-bold`} 
                onClick={() => setPage(totalPages)}
              >
                {totalPages}
              </Button>
            )}

            <Button 
              className="hover:bg-[#64439A] hover:text-white bg-white text-black font-bold border border-gray-400" 
              disabled={page === totalPages} 
              onClick={() => setPage(page + 1)}
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
