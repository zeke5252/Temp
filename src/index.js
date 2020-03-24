import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import "./sass/main.scss"
import Sign_in from "./components/SignIn"
import New_content from "./components/NewContent"
import Library from "./components/Library"
import Book_content from "./components/BookContent"
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
          <Route path={"*"} component={Sign_in} />
          <Redirect from="/Link" to="/" />
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