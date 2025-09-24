import React from 'react'

const PageTitle = ({title='제목', size='200px'}) => {
  return (
    <h2
      style={{
        borderTop : '2px solid brown',
        width : size,
        margin : '15px 0px',
        paddingLeft : '10px',
        color : 'brown',
        paddingTop : '5px'
      }}
    ><i className="fa-solid fa-cow"></i> {title}</h2>
  )
}

export default PageTitle