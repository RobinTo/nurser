
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

export default class nurser extends Component {

    constructor() {
        super();
        this.state = {
            timing: false,
            current: null,
            feedings: []
        };
    }

    _startFeeding(side) {
        this.setState({
            timing: true,
            currentSide: side,
            start: new Date()
        });
    }

    _endFeeding(){
        var now = new Date();
        var feeding = {
            side: this.state.currentSide,
            start: this.state.start,
            end: now,
            length: now - this.state.start
        };
        this.setState({
            timing: false,
            start: null,
            currentSide: null,
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
            var seconds = Math.floor(currentFeeding.length/1000);
            var minutes = Math.floor(seconds/60);
            seconds = seconds%60;
            var hours = Math.floor(minutes/60);
            minutes = minutes%60;
            var style;
            if(currentFeeding.side === 'right'){
                style = styles.rightFeeding;
            } else {
                style = styles.leftFeeding;
            }
            feedings.push(<Text style={style} key={currentFeeding.start.toString()}>{hours}:{minutes}:{seconds}</Text>)
        }

        return (
            <View style={styles.container}>
                <View style={styles.feedingsList}>
                    {feedings}
                </View>
                <View style={styles.middleBox} />
                <View style={styles.buttonContainer}>
                    <TouchableHighlight onPress={(() => {this.handlePress.call(this, 'left')}).bind(this)}>
                        <Text>Left</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={(() => {this.handlePress.call(this, 'right')}).bind(this)}>
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
    }
})