import React from 'react'
import styles from './Select.module.css'

const Select = ({children, size='200px', ...props}) => {
  return (
    <select
      className={styles.common_select}
      style={{width : size}}
      {...props}
    >{children}</select>
  )
}

export default Select