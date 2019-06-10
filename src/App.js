import React, { Component } from 'react'
import './styles/App.css'
import InputForm from './localComponents/inputForm'
import Header from './localComponents/Header'
import NutritionCard from './localComponents/NutritionCard'
import Footer from './localComponents/Footer'
import MakeCall from './globalComponents/makeCall'
import LoadingModal from './localComponents/loadingModal'
import Swal from 'sweetalert2'
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

class App extends Component {
  constructor() {
    super();
    // Create an empty initial state;
    this.state = {
      nutriData: {},
      userInput: '',
      nutritionVisible: false,
      macroNutrients: {},
      loading: false
    }
  }


  componentDidMount() {
    this.setState({
      loading: true
    })
    MakeCall('macroNutrients').then((response) => {
      let newState = response
      this.setState({
        macroNutrients: newState
      })
    }).then(() => {
      setTimeout(() => {
        this.setState({
          loading: false
        })
      }, 1000)
    }).catch(error => {
      console.log(error)
      this.setState({
        loading: false
      })
      return Swal.fire({
        title: 'Uh oh!',
        text: `Something happened on our end! Please try reloading!`,
        type: 'error',
        confirmButtonText: 'Okay'
      })
    })
  }

  callBackData = (d) => {
    this.setState({ nutriData: d })
  }

  showNutritionCard = () => {
    this.setState({
      nutritionVisible: true
    })
  }

  loadHandler = (s) => {
    this.setState({
      loading: s
    })
  }

  render() {
    return (
      <div className="App">
        {this.state.loading === true ?
          <LoadingModal />
          : null}
        {console.log(this.state.macroNutrients)}
        <Header />
        <main className="wrapper">
          <InputForm
            data={this.callBackData}
            toggleCard={this.showNutritionCard}
            value={this.state.userInput}
            loading={this.loadHandler}
          />
        </main>
          {this.state.nutritionVisible ? <NutritionCard
            commonData={this.state.nutriData.common}
            brandedData={this.state.nutriData.branded}
            value={this.state.userInput}
            nutrients={this.state.macroNutrients}
          /> : null}
        <Footer />
      </div>
    );
  }
}

export default App;
