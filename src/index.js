import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import "./sass/main.scss"
import Sign_in from "./components/sign_in"
import New_content from "./components/new_content"
import Library from "./components/library"
import Book_content from "./components/book_content"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "./configureStore"

class App extends React.Component {
  constructor (props) {
    super(props)
  }
  
  render () {
    return (
        <Switch>
          <Route path={"/"} component={Sign_in} exact />
          <Route path={"/" + "library"} component={Library} />
          <Route path={"/" + "new_content"} component={New_content} />
          <Route path={"/" + "book_content"} component={Book_content} />
        </Switch>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <App />
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
)