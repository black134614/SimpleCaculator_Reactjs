import React, { Component } from 'react'

export default class SimpleCaculator extends Component {
    //Create state value
    //oldValue for display value to top of caculator, display value is result
    //Set value input from click number button
    //Set value when click operator button
    //Clear one char when click C button
    //Clear all char when click CE button
    //Show recently value and operator
    //Show result
    //user input from key board
    /*support funtion: 
        - Check number is decimal
        - fixNumberString
    */
    state = {
        oldValue: '',
        operator: '',
        displayValue: '0'
    }

    numberClickHandler = (e) => {
        const value = e.target.innerText;
        this.setNumberValue(value);
    }
    // create setNumberValue use for user input number from keyboard
    // this have a bug is if after user equal do math.
    setNumberValue = (value) => {
        // easy call state value
        const {
            operator,
            displayValue
        } = this.state;
        // easy call function
        const {
            fixNumberString
        } = this;
        // handle number input -> set state
        //////3 case: input (number) & (input .) & (prevent input 000000)
        let result;
        if (value === '0') {
            if (displayValue === '0') {
                return;
            }
        }
        if (value === '.') {
            if (!operator && !this.isDecimal(displayValue)) {
                result = fixNumberString(displayValue + value);
                this.setState({
                    displayValue: result
                })
            }
            //return if the display value has . before
            return;
        }
        else {
            result = fixNumberString(displayValue + value);
            this.setState({
                displayValue: result
            })
        }
    }
    operatorClickHandler = (e) => {
        const operatorChar = e.target.innerText;
        this.setOperator(operatorChar);
    }
    //create setOperator for user input from key board
    setOperator = (operatorChar) => {
        //show operator
        /* case
            - no display value (0) & old value
            - only had display value
            - had old value and display value -> do math
            - change operator when had old value no display 
        */
        // do the math if current state oldValue & displayValue has value
        const {
            oldValue,
            displayValue
        } = this.state;
        const {
            calculate
        } = this;
        if (displayValue === '0' && !oldValue) {
            return;
        }
        else if (displayValue === '0' && oldValue) {
            this.setState({
                operator: operatorChar,
            })
        }
        else if (!oldValue) {
            this.setState({
                oldValue: displayValue,
                operator: operatorChar,
                displayValue: '0'
            })
        }
        else {
            this.setState({
                oldValue: calculate(),
                operator: operatorChar,
                displayValue: '0'
            })
        }
    }
    deleteChar = () => {
        /* case
            - delete display value 
            - delete operator
         */
        const {
            displayValue
        } = this.state;
        if (displayValue === '0') {
            return;
        }
        else {
            if (displayValue.length !== 1) {
                try {
                    this.setState({
                        displayValue: displayValue.slice(0, -1)
                    })
                } catch (error) {
                    this.setState({
                        displayValue: '0'
                    })
                }
            }
            else {
                //this also remove result after click equal button
                this.setState({
                    displayValue: '0'
                })
            }
        }
    }
    allClear = () => {
        this.setState({
            oldValue: '',
            operator: '',
            displayValue: '0'
        })
    }
    equalHandler = () => {
        if (this.state.oldValue && this.state.operator && this.state.displayValue !== '0') {
            this.setState({
                oldValue: this.calculate(),
                operator: '',
                displayValue: '0'
            })
        }
    }
    //Called immediately after a component is mounted
    _isMounted = false; // hide warning message 
    componentDidMount() {
        const { keypressHandler } = this
        document.addEventListener('keyup', ev => {
            keypressHandler(ev);
        })
    }

    keypressHandler = ev => {
        const {
            setNumberValue,
            setOperator,
            equalHandler,
            allClear,
            deleteChar,
        } = this
        //js regex rule
        const numRegex = /^([0-9]|\.)*$/g;
        const opRegex = /[+|\-|/|*]/g;
        const eqRegex = /(=)/g;
        const delRegex = /(Backspace|Delete)/g;
        const acRegex = /(Escape)/g;
        const key = ev.key;

        if (key && !!numRegex.exec(key)) {
            setNumberValue(key + '');
        }

        if (key && !!opRegex.exec(key)) {
            setOperator(key + '');
        }

        if (key && !!eqRegex.exec(key)) {
            equalHandler();
        }

        if (key && !!delRegex.exec(key)) {
            deleteChar();
        }

        if (key && !!acRegex.exec(key)) {
            allClear();
        }
    }
    //support function 

    //check decimal value if value has . it will return false.
    isDecimal = (value) => {
        return value.indexOf('.') > -1;
    }

    fixNumberString = (value) => {
        // remove redundant 0 : 00000 -> 0
        if (value.indexOf('0') === 0 && value.indexOf('0.') === -1) {
            return value.substring(1);
        }
        // if value. -> 0.
        if (value.indexOf('.') === 0 && value.length === 1) {
            return '0.';
        }
        if (!value) {
            return '0';
        }
        return value;
    }

    calculate = () => {
        const {
            oldValue,
            operator,
            displayValue
        } = this.state;
        let result = '0'; // if in devison by 0 return 0
        switch (operator) {
            case '+':
                result = parseFloat(oldValue) + parseFloat(displayValue);
                break;
            case '-':
                result = parseFloat(oldValue) - parseFloat(displayValue);
                break;
            case '*':
                result = parseFloat(oldValue) * parseFloat(displayValue);
                break;
            default:
                if (parseFloat(displayValue) !== 0) {
                    result = parseFloat(oldValue) / parseFloat(displayValue);
                }
                break;
        }
        return result;
    }
    render() {
        return (
            <div style={{ width: 360, padding: 20, margin: 'auto', marginTop: 100, backgroundColor: 'gray' }}>
                <div className="row">
                    <div className="col-12">
                        <span style={{ height: 30, fontSize: 20 }} className='bg-secondary text-white d-block text-right'>{!this.state.oldValue ? '---' : this.state.oldValue + " " + this.state.operator}</span>
                    </div>
                    <div className="col-12 mb-2">
                        <span style={{ height: 40, fontSize: 30, lineHeight: '40px' }}
                            className='bg-white d-block text-right'>{this.state.displayValue}</span>
                    </div>
                    <div className="col-12 d-flex flex-column">
                        <div className="d-flex">
                            <button onClick={this.numberClickHandler.bind(this)} className="btn btn-light btn-lg">7</button>
                            <button onClick={this.numberClickHandler.bind(this)} className="btn btn-light btn-lg">8</button>
                            <button onClick={this.numberClickHandler.bind(this)} className="btn btn-light btn-lg">9</button>
                            <button onClick={this.operatorClickHandler.bind(this)} className="btn btn-light btn-lg">/</button>
                            <button onClick={() => { this.allClear() }} className="btn btn-light btn-lg">CE</button>
                        </div>
                        <div className="d-flex">
                            <button onClick={this.numberClickHandler.bind(this)} className="btn btn-light btn-lg">4</button>
                            <button onClick={this.numberClickHandler.bind(this)} className="btn btn-light btn-lg">5</button>
                            <button onClick={this.numberClickHandler.bind(this)} className="btn btn-light btn-lg">6</button>
                            <button onClick={this.operatorClickHandler.bind(this)} className="btn btn-light btn-lg">*</button>
                            <button onClick={() => { this.deleteChar() }} className="btn btn-light btn-lg">C</button>
                        </div>
                        <div className="d-flex">
                            <div className="d-flex flex-column">
                                <div className="d-flex">
                                    <button onClick={this.numberClickHandler.bind(this)} className="btn btn-light btn-lg">1</button>
                                    <button onClick={this.numberClickHandler.bind(this)} className="btn btn-light btn-lg">2</button>
                                    <button onClick={this.numberClickHandler.bind(this)} className="btn btn-light btn-lg">3</button>
                                    <button onClick={this.operatorClickHandler.bind(this)} className="btn btn-light btn-lg">-</button>
                                </div>
                                <div className="d-flex">
                                    <button onClick={this.numberClickHandler.bind(this)} className="btn btn-light btn-lg" style={{ flex: '1 1 auto' }}>0</button>
                                    <button onClick={this.numberClickHandler.bind(this)} className="btn btn-light btn-lg">.</button>
                                    <button onClick={this.operatorClickHandler.bind(this)} className="btn btn-light btn-lg">+</button>
                                </div>
                            </div>
                            <div className="d-flex">
                                <button onClick={() => { this.equalHandler() }}
                                    className="btn btn-light btn-lg" style={{ height: 'auto' }}>=</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
