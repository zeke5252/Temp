import React from 'react'
import styles from '../sass/main.scss'

export default class Sign_in extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return(
        <div >
            <h1 className={styles.main}>This is a sign inup panel.</h1>
        </div>        
    )
  }
}