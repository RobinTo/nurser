
import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableHighlight } from 'react-native';

const nursingMethods = {
    bottle: 'bottle',
    left: 'left',
    right: 'right',
    food: 'food'
};

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

        return <Text key={startString} style={styles[currentFeeding.method]} key={currentFeeding.start.toString()}>{currentFeeding.method}: {startString} - {hours}:{minutes}:{seconds}</Text>;
    }

    render() {
        let comp = this._getFeedingString(this.props.feeding);
        return comp;
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
        
        for(var i = 0; i < this.state.feedings.length; i++){
            var currentFeeding = this.state.feedings[i];
            
            feedings.push(<Feeding feeding={currentFeeding} />);
        }

        return (
            <View style={styles.container}>
                <ScrollView style={styles.feedingsList}>
                    {feedings}
                </ScrollView>
                <View style={styles.middleBox} />
                <View style={styles.buttonContainer}>
                    <TouchableHighlight onPress={(() => {this.handlePress.call(this, nursingMethods.left)}).bind(this)}>
                        <Text>Left</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={(() => {this.handlePress.call(this, nursingMethods.bottle)}).bind(this)}>
                        <Text>Bottle</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={(() => {this.handlePress.call(this, nursingMethods.food)}).bind(this)}>
                        <Text>Food</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={(() => {this.handlePress.call(this, nursingMethods.right)}).bind(this)}>
                        <Text>Right</Text>
                    </TouchableHighlight>
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
        flex: 1,
        backgroundColor: 'powderblue'
    },
    middleBox: {
        flex: 2,
        backgroundColor: 'skyblue'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'steelblue'
    },
    leftFeeding: {
        textAlign: 'left'
    },
    rightFeeding: {
        textAlign: 'right'
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
    }
})