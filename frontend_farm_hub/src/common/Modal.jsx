import React, { useEffect } from 'react'
import styles from './Modal.module.css'

const Modal = ({
  size = '500px',
  title = '',
  isOpen = false,
  onClose,
  children
}) => {

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();}};
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);}
    return () => {
      window.removeEventListener('keydown', handleEsc);};
  }, [isOpen, onClose]);

  //isOpen이 false면 모달을 닫는다.
  if(!isOpen) return null

  return (
    <div className={styles.modal_overlay}>
      <div
        className={styles.modal_content}
        style={{width:size}}
        //여기에는 변수를 써서 디자인할 수 있음,App에서 props로 받아올 수 있음
      >
        <div className={styles.modal_title}>
          <button
            type="button"
            className={styles.close_btn}
            onClick={onClose}
          >
            <i className="bi bi-x"></i>
          </button>
          <p>{title}</p>
        </div>
        <div className={styles.content_div}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal