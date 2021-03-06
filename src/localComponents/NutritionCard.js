import React, { Component } from 'react';
import firebase from './../globalComponents/firebase'
import DetailedCards from './detailedNutritionCard'
import SimpleCards from './foodSearch'

class NutritionCard extends Component {
  constructor() {
    super();
    this.state = {
      nutrientValues: [
        { attr_id: 208 }, // calories
        { attr_id: 205 }, // carbs
        { attr_id: 204 }, // fats
        { attr_id: 203 }, // proteins
        { attr_id: 307 }, // sodium
        { attr_id: 269 }, // sugars
        { attr_id: 301 }, // calcium
        { attr_id: 318 }, // vitA
        { attr_id: 415 }, // vitB6
        { attr_id: 401 }, // vitC
        { attr_id: 324 }, // vitD
        { attr_id: 323 }, // vitE
        { attr_id: 303 }, // iron
        { attr_id: 304 }, // magnesium
        { attr_id: 309 } // zinc
      ],
      nutrientValuesSimple: [
        { attr_id: 318 }, // vitA
        { attr_id: 415 }, // vitB6
        { attr_id: 401 }, // vitC
        { attr_id: 324 }, // vitD
        { attr_id: 323 }, // vitE
        { attr_id: 303 }, // iron
        { attr_id: 304 }, // magnesium
        { attr_id: 309 } // zinc
      ],
      itemList: [],
      compareList: [],
      detailed: false
    }
  }

  componentDidMount() {
    this.retrieveFirebase();
    const processInfo = (id) => {
      return this.props.nutrients.find((i) => i.attr_id === id)
    }
    let currVal
    let newVals = []
    for (let i = 0; i < this.state.nutrientValues.length; i++) {
      currVal = processInfo(this.state.nutrientValues[i].attr_id)
      newVals[i] = { attr_id: currVal.attr_id, usda_nutr_desc: currVal.usda_nutr_desc, unit: currVal.unit }
    }
    let newVals2 = []
    for (let i = 0; i < this.state.nutrientValuesSimple.length; i++) {
      currVal = processInfo(this.state.nutrientValuesSimple[i].attr_id)
      newVals2[i] = { attr_id: currVal.attr_id, usda_nutr_desc: currVal.usda_nutr_desc, unit: currVal.unit }
    }
    this.setState({
      nutrientValues: newVals,
      nutrientValuesSimple: newVals2
    })
    this.retrieveCompareList();
  }

  readMoreToggle = () => {
    if (this.state.detailed === true) {
      this.setState({
        detailed: false
      })
    } else {
      this.setState({
        detailed: true
      })
    }
  }

// creating a function that will retreive our saved items in firebase
  retrieveFirebase = () => {
    const dbRef = firebase.database().ref('savedItems/');
    dbRef.on('value', (response) => {
      const itemList = [];
      const data = response.val();
      // creating an empty array to update state with

      for (let key in data) {
        itemList.push({
          name: data[key].tag_name,
          firebaseId: key
        })
      }
      // pushing specific key and tag name to the itemList array

      this.setState({
        itemList
      })
    })
  }

  // creating a function that will check the index of each item name
  checkDuplicates = (item) => {
    const simpleArr = this.state.itemList.map(item => {
      return item.name
    })

    if (simpleArr.indexOf(item) > -1) {
      return true
    }
  }

// creating a function to check the firebase ID and the index of each item
  generateFirebaseId = (item) => {
    const simpleArr = this.state.itemList.map(item => {
      return item.name
    })

    const index = simpleArr.indexOf(item)

    if (index > -1) {
      return this.state.itemList[index].firebaseId
    }
  }

  retrieveCompareList = () => {
    const dbRef = firebase.database().ref('comparedItems/');
    dbRef.on('value', (response) => {
      const compareList = [];
      const data = response.val();
      // creating a empty array to set state with using the compared items

      // pushing specific key of compared data to new array
      for (let key in data) {
        compareList.push({
          data: data[key]
        })
      }

      this.setState({
        compareList
      })
    })
  }

  addToCompare = (e) => {
    e.preventDefault();
    const position = e.target.id
    // creating a variable to access the id of compared item
    const dbRef = firebase.database().ref(`comparedItems/`)
    if (this.state.compareList.length < 2) {
      dbRef.push(this.props.commonData[position]);
    } else {
      dbRef.remove();
      dbRef.push(this.props.commonData[position]);
    }

  }

  handleSaveItem = (e) => {
    e.preventDefault();
    const position = e.target.id;
    const item = e.target.value;

    // creating variables to access the value and id of saved items

    const isDuplicate = this.checkDuplicates(item)

    // undefined is false-y but it's not actually a boolean 
    if (!isDuplicate) {
      const dbRef = firebase.database().ref('savedItems/');
      dbRef.push(this.props.commonData[position]);
    } else {
      const itemRef = firebase.database().ref(`savedItems/${[e.target.dataset.id]}`)
      itemRef.remove();
    }
  }

  render() {
    return (
      <div className="gallery-field">
        <div className="wrapper">
          <SimpleCards
            commonData={this.props.commonData}
            nutrientValues={this.state.nutrientValuesSimple}
            handleSaveItem={this.handleSaveItem}
            generateFirebaseId={this.generateFirebaseId}
            checkDuplicates={this.checkDuplicates}
            addToCompare={this.addToCompare}
            readMoreToggle={this.readMoreToggle}
            detailed={this.state.detailed}
          />
          <DetailedCards
            commonData={this.props.commonData}
            nutrientValues={this.state.nutrientValues}
            handleSaveItem={this.handleSaveItem}
            generateFirebaseId={this.generateFirebaseId}
            checkDuplicates={this.checkDuplicates}
            addToCompare={this.addToCompare}
            readMoreToggle={this.readMoreToggle}
            detailed={this.state.detailed}
          />
        </div>
      </div>
    )
  }
}


export default NutritionCard;