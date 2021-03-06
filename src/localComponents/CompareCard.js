import React, { Component } from 'react';


class CompareCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nutrientValues: [
                { attr_id: 208 }, // calories
                { attr_id: 204 }, // fats
                { attr_id: 205 }, // carbs
                { attr_id: 269 }, // sugars
                { attr_id: 318 }, // vitA
                { attr_id: 324 }, // vitD
                { attr_id: 415 }, // vitB6
                { attr_id: 401 }, // vitC
                { attr_id: 323 }, // vitE
                { attr_id: 304 }, // magnesium
                { attr_id: 309 }, // zinc
                { attr_id: 303 } // iron
            ],
            newList: []
        }
    }

    componentDidMount() {
        // creating an empty array with variable newList
        const newList = []
        const compareList = this.props.compareList

        // pushing each argument to the array with specific value
        compareList.forEach(function (element) {
            newList.push(element)
        })

        // setting state with the new array
        this.setState({
            newList
        })

        // using the props to find a specific id for each nutrient
        const processInfo = (id) => {
            return this.props.nutrients.find((i) => i.attr_id === id)
        }
        let currVal
        let newVals = []
        // looping over the nutrtient values and pushing it to the new array
        for (let i = 0; i < this.state.nutrientValues.length; i++) {
            currVal = processInfo(this.state.nutrientValues[i].attr_id)
            newVals[i] = { attr_id: currVal.attr_id, usda_nutr_desc: currVal.usda_nutr_desc, unit: currVal.unit }
        }
        this.setState({
            nutrientValues: newVals
        })
    }


    render() {
        return (
            <div className="compare-container">
                {this.state.newList && this.state.newList.map((element, i) => {
                    let thisValues = this.state.nutrientValues.map((n, id) => {
                        let capturedNutrients = element.data.full_nutrients.find((key) => key.attr_id === n.attr_id)
                        return capturedNutrients
                        // mapping over the newList array and capturing the specific key for that nutrient
                    })
                    return (
                        <div>
                            {/* displaying the values on the page with nutrition information */}
                            <div className="nutrition-card">
                                <h2>{element && element.data.tag_name}</h2>
                                <h3>Nutrition Facts</h3>
                                <p className="line">{element && element.data.serving_qty} {element && element.data.serving_unit}</p>
                                <ul>
                                    {thisValues.map((n, id) => {
                                        if (n === undefined) {
                                            return null
                                        } else {
                                            return (
                                                <li><p>{this.state.nutrientValues[id].usda_nutr_desc}</p><p>{n.value.toFixed(2)} {this.state.nutrientValues[id].unit}</p></li>
                                            )
                                        }
                                    }
                                    )}
                                </ul>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default CompareCard;