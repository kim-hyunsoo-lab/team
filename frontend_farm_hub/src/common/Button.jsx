import React from 'react'
import styles from './Button.module.css'

const Button = ({title='버튼', color='brown', size='100px', ...props}) => {
  return (
    <button
      type='button'
      className={`${styles.common_btn} ${styles[color]} ${props.disabled && styles.disabled}`}
      style={{width : size}}
      {...props}
    >{title}</button>
  )
}

export default Button