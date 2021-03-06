import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { doubleDigit } from '../utils/utils';

export default class Feeding extends Component {

    constructor(){
        super();
        this.state = {
            delete: false
        }
    }

    _disableDeletion(){
        this.setState({
            delete: false
        });
    }

    _delete() {
        if(this.props.feeding.noDelete){
            return;
        }
        if(this.state.delete){
            this.props.delete(this.props.id);
            clearTimeout(this.cancelDeleteTimeout);
            return;
        }
        this.setState({
            delete: true
        });

        this.cancelDeleteTimeout = setTimeout(this._disableDeletion.bind(this), 5000);
    }

    componentWillUnmount(){
        clearTimeout(this.cancelDeleteTimeout);
    }

    _getLengthString(length){
        if(!length){
            return 'Ongoing...';
        }
        var seconds = Math.floor(length/1000);
        var minutes = Math.floor(seconds/60);
        seconds = seconds%60;
        var hours = Math.floor(minutes/60);
        minutes = minutes%60;
        return `Duration ${doubleDigit(hours)}:${doubleDigit(minutes)}:${doubleDigit(seconds)}`;
    }

    _getFeedingString(currentFeeding) {

        var startTime = currentFeeding.start,
            startString = '',
            endTime = currentFeeding.end,
            endString = '';
        startString += doubleDigit(startTime.getHours()) + ':' + doubleDigit(startTime.getMinutes());
        if(!endTime){
            endString = 'now';
        } else {
            endString += doubleDigit(endTime.getHours()) + ':' + doubleDigit(endTime.getMinutes());
        }

        let durationString = this._getLengthString(currentFeeding.length);

        return (<View>
            <Text style={styles.feedingTimes}>{startString} - {endString}</Text>
            <Text style={styles.feedingDuration}>{durationString}</Text>
        </View>);
    }

    render() {
        let comp = this._getFeedingString(this.props.feeding);

        let methodString,
            methodStyles = [styles.button];
        if(this.state.delete){
            methodStyles.push(styles.redButton);
            methodString = 'X';
        } else {
            methodString = this.props.feeding.method.substr(0, 1).toUpperCase() + this.props.feeding.method.substr(1);
        }
        return (<View style={styles.feedingContainer}>
            <View style={[styles.verticalAligner, styles.horizontalAligner]}>
                <TouchableHighlight underlayColor={'transparent'} onPress={this._delete.bind(this)}>
                    <Text style={methodStyles}>{methodString}</Text>
                </TouchableHighlight>
            </View>
            <View style={[styles.verticalAligner, styles.flex3]}>
                {comp}
            </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    feedingContainer: {
        padding: 4,
        flex: 1,
        flexDirection: 'row'
    },
    verticalAligner: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    horizontalAligner: {
        alignItems: 'center'
    },
    button: {
        width: 60,
        height: 60,
        textAlign: 'center',
        lineHeight: 38,
        backgroundColor: 'white',
        borderRadius: 30
    },
    redButton: {
        backgroundColor: 'red',
        color: 'white',
        fontWeight: 'bold',
    },
    flex3: {
        flex: 3
    },
    feedingTimes: {
        fontWeight: 'bold',
    },
    feedingDuration: {

    },
})