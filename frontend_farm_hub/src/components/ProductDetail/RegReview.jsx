import React from 'react'
import Modal from '../../common/Modal'
import styles from './regReview.module.css'
import Input from '../../common/Input'
import Textarea from '../../common/Textarea'
import Button from '../../common/Button'

const RegReview = ({isOpenRegReview}) => {
  return (
    <Modal isOpen={isOpenRegReview}>
      <div className={styles.container}>
        <h4>이용 후기 작성</h4>
        <table className={styles.reg_review_table}>
          <tbody>
            <tr>
              <td>제목</td>
              <td>
                <Input size='100%' />
              </td>
            </tr>
            <tr>
              <td>별점</td>
              <td>
                <Input size='100%' />
              </td>
            </tr>
            <tr>
              <td>내용</td>
              <td>
                <Textarea width='100%' />
              </td>
            </tr>
          </tbody>
        </table>
        <div className={styles.btn_div}>
          <Button title='등록' />
          <Button title='취소' />
        </div>
      </div>
    </Modal>
  )
}

export default RegReview