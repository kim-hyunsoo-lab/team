import React from 'react'
import styles from './Input.module.css'

const Input = ({size='300px', color='brown', ...props}) => {
  return (
    <input style={{width: size}} className={styles.input} {...props} />
  )
}

export default Input