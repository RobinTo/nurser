
import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, TouchableHighlight } from 'react-native';

const nursingMethods = {
    bottle: 'bottle',
    left: 'left',
    right: 'right',
    food: 'food'
};

function _doubleDigit(n){
    if(n < 10) {
        return '0' + n.toString();
    }
    return n.toString();
}

class Feeding extends Component {

    _getFeedingString(currentFeeding) {
        var seconds = Math.floor(currentFeeding.length/1000);
        var minutes = Math.floor(seconds/60);
        seconds = seconds%60;
        var hours = Math.floor(minutes/60);
        minutes = minutes%60;

        var startTime = currentFeeding.start,
            startString = '';
        startString += startTime.getDate() + '/' + (startTime.getMonth()+1).toString() + ' ' + startTime.getHours() + ':' + startTime.getMinutes();

        return <Text style={styles[currentFeeding.method]} key={currentFeeding.start.toString()}>{currentFeeding.method}: {startString} - {hours}:{minutes}:{seconds}</Text>;
    }

    render() {
        let comp = this._getFeedingString(this.props.feeding);
        return (<View style={styles.feedingContainer}>
            <Text style={styles.button}>Right</Text>
            {comp}
        </View>);
    }
}

class FeedingTimer extends Component {

    constructor(){
        super();
        this.state = {
            time: 0
        }
    }

    componentDidMount() {
        this.myInterval = setInterval(this._updateTimer.bind(this), 500);
    }

    componentWillUnmount() {
        clearInterval(this.myInterval);
    }

    _updateTimer() {
        if(!this.props.current){
            this.setState({
                time: 0
            });
            return;
        }
        let delta = (new Date() - this.props.current);
        var seconds = Math.floor(delta/1000);
        var minutes = Math.floor(seconds/60);
        seconds = seconds%60;
        var hours = Math.floor(minutes/60);
        minutes = minutes%60;
        this.setState({
            time: _doubleDigit(hours) + ':' + _doubleDigit(minutes) + ':' + _doubleDigit(seconds),
        });
    } 

    render(){
        if(!this.props.current || !this.state.time) {
            return <Text style={styles.timer}>00:00:00</Text>
        }
        return (<Text style={styles.timer}>{this.state.time}</Text>)
    }
}


export default class nurser extends Component {

    constructor() {
        super();
        this.state = {
            timing: false,
            currentMethod: null,
            feedings: []
        };
    }

    _startFeeding(method) {
        this.setState({
            timing: true,
            currentMethod: method,
            start: new Date()
        });
    }

    _endFeeding(){
        var now = new Date();
        var feeding = {
            method: this.state.currentMethod,
            start: this.state.start,
            end: now,
            length: now - this.state.start
        };
        this.setState({
            timing: false,
            start: null,
            currentMethod: null,
            feedings: [...this.state.feedings, feeding]
        });
    }

    handlePress(side){
        if(this.state.timing){
            this._endFeeding();
        } else {
            this._startFeeding(side);
        }
    }

    render() {
        var feedings = [];
        
        for(var i = this.state.feedings.length-1; i>= 0; i--){
            var currentFeeding = this.state.feedings[i];
            
            feedings.push(<Feeding key={i+currentFeeding.start.toString()} feeding={currentFeeding} />);
        }

        return (
            <View style={styles.container}>
                <View style={styles.feedingsList}>
                    <ScrollView>
                        {feedings}
                    </ScrollView>
                </View>
                <View style={styles.middleBox}>
                    <FeedingTimer current={this.state.start} />
                </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonVerticalAligner}>
                        <TouchableHighlight activeOpacity={0} onPress={(() => {this.handlePress.call(this, nursingMethods.left)}).bind(this)}>
                            <Text style={styles.button}>Left</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.buttonVerticalAligner}>
                        <TouchableHighlight activeOpacity={0} onPress={(() => {this.handlePress.call(this, nursingMethods.food)}).bind(this)}>
                            <Text style={styles.button}>Food</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.buttonVerticalAligner}>
                        <TouchableHighlight activeOpacity={0} onPress={(() => {this.handlePress.call(this, nursingMethods.bottle)}).bind(this)}>
                            <Text style={styles.button}>Bottle</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.buttonVerticalAligner}>
                        <TouchableHighlight activeOpacity={0} onPress={(() => {this.handlePress.call(this, nursingMethods.right)}).bind(this)}>
                            <Text style={styles.button}>Right</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    feedingsList: {
        flex: 4,
        backgroundColor: 'powderblue'
    },
    middleBox: {
        flex: 1,
        backgroundColor: 'skyblue'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'steelblue'
    },
    buttonVerticalAligner: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    feedingContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    bottle: {
        color: 'white'
    },
    left: {
        color: 'blue'
    },
    right: {
        color: 'red'
    },
    food: {
        color: 'green'
    },
    button: {
        width: 60,
        height: 60,
        textAlign: 'center',
        lineHeight: 38,
        backgroundColor: 'white',
        borderRadius: 30
    },
    timer: {
        width: '100%',
        fontSize: 42,
        textAlign: 'center'
    }
})