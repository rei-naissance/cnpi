import React from 'react'

const Error = ({message} : {message: string}) => {
  return (
    <span className="text-sm text-red-500">{message}</span>
  )
}

export default Error