import React, { Component } from 'react';
// import ListContacts from './ListContacts'
import * as ContactsAPI from './utils/ContactsAPI'
// import CreateContact from './CreateContact'
import { Route } from 'react-router-dom'
// import asyncComponent from './AsyncComponent'
import Loadable from 'react-loadable'
import MyLoadingComponent from './MyLoadingComponent'


const LoadableListContacts = Loadable({
  loader: () => import('./ListContacts'),
  loading: MyLoadingComponent
})
const LoadableCreateContact = Loadable({
  loader: () => import("./CreateContact"),
  loading: MyLoadingComponent
})

class App extends Component {
  state = {
    contacts: []
  }

  componentDidMount() {
    ContactsAPI.getAll()
      .then((contacts) => {
        this.setState(() => ({
          contacts
        }))
      })
  }

  removeContact = (contact) => {
    this.setState( (currentState) => ({
      contacts: currentState.contacts.filter((c)=>{
        return c.id !== contact.id
      })
    }) )

    ContactsAPI.remove(contact)
  }

  createContact = (contact) => {
    ContactsAPI.create(contact)
      .then((contact) => {
        this.setState((currentState) => ({
          contacts: currentState.contacts.concat([contact])
        }))
      })
  }

  render() {
    return (
      <div className="App">
        <Route exact path='/' render={()=>(
          <LoadableListContacts
            contacts={this.state.contacts}
            onDeleteContact={this.removeContact}
          />
        )} />
        <Route path='/create' render={({ history }) => (
          <LoadableCreateContact
            onCreateContact={(contact)=> {
              this.createContact(contact)
              history.push('/')
            }}
          />
        )} />
      </div>
    );
  }
}

export default App;
