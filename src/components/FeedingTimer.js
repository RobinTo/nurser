import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { doubleDigit } from '../utils/utils';

export default class FeedingTimer extends Component {

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

    setNativeProps (nativeProps) {
        this._root.setNativeProps(nativeProps);
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
            time: doubleDigit(hours) + ':' + doubleDigit(minutes) + ':' + doubleDigit(seconds),
        });
    } 

    render(){
        if(!this.props.current || !this.state.time) {
            return <Text ref={component => this._root = component} style={styles.timer}>00:00:00</Text>
        }
        let timerStyles = [styles.timer];
        if(this.props.active){
            timerStyles.push(styles.active);
        }
        return (<Text ref={component => this._root = component} style={timerStyles}>{this.state.time}</Text>)
    }
}

const styles = StyleSheet.create({
    timer: {
        width: '100%',
        fontSize: 42,
        textAlign: 'center'
    },
    active: {
        color: '#66ff00',
    }
})