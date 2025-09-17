import React from 'react'

const Textarea = ({width='200px', height=5, ...props}) => {
  return (
    <textarea
      style={{
        width : width,
        border : '1px solid brown',
        resize : 'none'
      }}
      rows={height}
      {...props}
    />
  )
}

export default Textarea