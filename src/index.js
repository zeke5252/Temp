import React from 'react'
import ReactDOM from 'react-dom'
import styles from './index.scss'

class Test extends React.Component {
  constructor (props) {
    super(props)
    this.dataAll = {
      hightlightText: '',
      dicMerriamAPI: 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/',
      transGoogleAPI:'https://translation.googleapis.com/language/translate/v2',
      apiKeyMerriam: '1c8b8f95-5745-4aae-834d-ad6674ea2f13',
      apiKeyGoogle:'AIzaSyBr4QB1H8JxbgRnSOLvCH2g3rCN691RwqM'
    }
  }

  componentDidMount () {
    document.onmouseup = () => {
      //Get the hightlight text
      this.dataAll.hightlightText = window
        .getSelection()
        .toString()
        .trim()
      if (
        this.dataAll.hightlightText.split(' ').length === 1 &&
        this.dataAll.hightlightText !== ''
      ) {
        // Use Merriam-Webster dictionary api
        fetch(
          `${this.dataAll.dicMerriamAPI}${this.dataAll.hightlightText}?key=${this.dataAll.apiKeyMerriam}`
        )
          .then(res => res.json())
          .then(res => {
            console.log(res)
          })
      } else {
        console.log('text=', `${this.dataAll.transGoogleAPI}?key=${this.dataAll.apiKeyGoogle}?q=${this.dataAll.hightlightText}`)
        // Use Google translate api
        fetch(
          `${this.dataAll.transGoogleAPI}?key=${this.dataAll.apiKeyGoogle}&source=en&target=zh-CN&q=${this.dataAll.hightlightText}`
        )
          .then(res => res.json())
          .then(res => {
            console.log(res)
          })
      }
    }
  }
  render () {
    return (
      <div>
        <h1 className={styles.main}>
          Aili said she was told that the reason why the Saudi patients insisted
          on receiving organs from Uyghur donors was that they wanted "Halal
          organs. " She said that when she asked a person on the scene how long
          recipients needed to wait to find a donor, she said the waiting times
          ranged between one to six months.She was also told that the donors
          were "slaughtered" on the basis of demand.She added that she had
          originally been skeptical about reports of harvesting of organs from
          Falun Gong prisoners and was shocked to learn that such practices were
          real.{' '}
        </h1>{' '}
      </div>
    )
  }
}

ReactDOM.render(<Test />, document.getElementById('root'))
