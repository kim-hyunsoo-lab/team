import React from 'react'
import styles from './Textarea.module.css'

const Textarea = ({width='200px', height=5, ...props}) => {
  return (
    <textarea
      style={{
        width : width,
        border : '1px solid brown',
        resize : 'none'
      }}
      rows={height}
      className={styles.common_textarea}
      {...props}
    />
  )
}

export default Textarea