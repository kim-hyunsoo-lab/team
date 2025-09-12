import React from 'react'
import styles from './Input.module.css'

const Input = ({size='300px', ...props}) => {
  return (
    <div
      className={styles.common_input}
      style={{
        width : size
      }}
      {...props}
    >
      <input type="text" />
      <span><i className="bi bi-search"></i></span>
    </div>
  )
}

export default Input