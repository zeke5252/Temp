import React from 'react'
import styles from '../sass/main.scss'

export default class Greetings extends React.Component {
  constructor (props) {
    super(props)
    this.state={
      slang:''
    }
  }

  componentDidMount(){
    let slangs = [`“Once you learn to read, you will be forever free.” — Frederick Douglass`,
`“The more that you read, the more things you will know. The more you learn, the more places you’ll go.”— Dr. Seuss, “I Can Read With My Eyes Shut!”`,
`“I find television very educating.  Every time somebody turns on the set, I go into the other room and read a book.” – Groucho Marx`,
`“There are many little ways to enlarge your world.  Love of books is the best of all.” – Jacqueline Kennedy`,
`“Today a reader, tomorrow a leader.” – Margaret Fuller`,
`“There is more treasure in books than in all the pirate’s loot on Treasure Island.” – Walt Disney`,
`“There are worse crimes than burning books.  One of them is not reading them.” – Ray Bradbury`,
`“Reading without reflecting is like eating without digesting.” – Edmund Burke`,
`“The reading of all good books is like conversation with the finest (people) of the past centuries.” – Descartes`,
`“Reading is to the mind what exercise is to the body.” – Richard Steele”`,
`“So please, oh PLEASE, we beg, we pray, Go throw your TV set away, And in its place you can install, A lovely bookshelf on the wall.” — Roald Dahl, Charlie and the Chocolate Factory`,
`“Reading is a discount ticket to everywhere.”  – Mary Schmich`,
`“Books are a uniquely portable magic.” – Stephen King`,
`“No entertainment is so cheap as reading, nor any pleasure so lasting. — Lady Montagu`,
`“To learn to read is to light a fire” — Victor Hugo, Les Miserables`,
`“You can find magic wherever you look.  Sit back and relax all you need is a book!” – Dr. Seuss`,
`“Books train your mind to imagination to think big – Taylor Swift`,
`“If you are going to get anywhere in life you have to read a lot of books.” – Roald Dahl`,
`“Reading is to the mind what exercise is to the body – Joseph Addison`,
`“The whole world opened up to me when I learned to read” – Mary McCleod Bethune`]
  }

  render () {
    return (
      <p className={styles.library_greeting}>
        Hi,
        <span className={styles.library_yourName}>{this.props.userName}</span>
        {!this.props.booksAll ? 'Add your file first': 'what would you like to read today?'}
      </p>
    )
  }
}
