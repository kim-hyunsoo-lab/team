import React from 'react'
import styles from './Input.module.css'

const Input = ({size='300px', color='brown', ...props}) => {
  return (
    <div
      className={`${styles.common_input} ${styles[color]}`}
      style={{
        width : size
      }}
      {...props}
    >
      <input type="text" {...props} />
      <span><i className="bi bi-search"></i></span>
    </div>
  )
}

export default Input