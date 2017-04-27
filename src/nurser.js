
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
            startString = '',
            endTime = currentFeeding.end,
            endString = '';
        startString += _doubleDigit(startTime.getHours()) + ':' + _doubleDigit(startTime.getMinutes());
        if(!endTime){
            endString = '-';
        } else {
            endString += _doubleDigit(endTime.getHours()) + ':' + _doubleDigit(endTime.getMinutes());
        }

        return (<View>
            <Text style={styles.feedingTimes} key={currentFeeding.start.toString()}>{startString} - {endString}</Text>
            <Text style={styles.feedingDuration}>Duration {_doubleDigit(hours)}:{_doubleDigit(minutes)}:{_doubleDigit(seconds)}</Text>
        </View>);
    }

    render() {
        let comp = this._getFeedingString(this.props.feeding);

        let methodString = this.props.feeding.method.substr(0, 1).toUpperCase() + this.props.feeding.method.substr(1);
        return (<View style={styles.feedingContainer}>
            <View style={[styles.verticalAligner, styles.horizontalAligner]}>
                <Text style={styles.button}>{methodString}</Text>
            </View>
            <View style={[styles.verticalAligner, styles.flex3]}>
                {comp}
            </View>
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
            time: _doubleDigit(hours) + ':' + _doubleDigit(minutes) + ':' + _doubleDigit(seconds),
        });
    } 

    render(){
        if(!this.props.current || !this.state.time) {
            return <Text ref={component => this._root = component} style={styles.timer}>00:00:00</Text>
        }
        return (<Text ref={component => this._root = component} style={styles.timer}>{this.state.time}</Text>)
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
        if(!this.state.timing){
            return;
        }
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
        let month = -1;
        let day = -1;
        for(var i = this.state.feedings.length-1; i>= 0; i--){
            var currentFeeding = this.state.feedings[i];
            if(currentFeeding.start.getMonth() > month || currentFeeding.start.getDate() > day){
                month = currentFeeding.start.getMonth();
                day = currentFeeding.start.getDate();
                feedings.push(<Text key={currentFeeding.end.toString()} style={styles.feedingTitle}>{currentFeeding.start.getMonth()+1}/{currentFeeding.start.getDate()}</Text>);
            }
            feedings.push(<Feeding key={i+currentFeeding.start.toString()} feeding={currentFeeding} />);
        }

        let feedingTimer = null,
            timerText = '';
        if(this.state.timing){
            timerText = 'Current feeding';
            feedingTimer = <FeedingTimer current={this.state.start} />;
        } else if (this.state.feedings.length > 0){
            timerText = 'Time since last feeding';
            feedingTimer = <FeedingTimer current={this.state.feedings.slice(-1)[0].end} />;
        } else {
            timerText = 'Start feeding';
            feedingTimer = <FeedingTimer current={null} />;
        }

        return (
            <View style={styles.container}>
                <View style={styles.feedingsList}>
                    <ScrollView>
                        {feedings}
                    </ScrollView>
                </View>
                <View style={styles.middleBox}>
                    <View style={styles.verticalAligner}>
                        <TouchableHighlight onPress={this._endFeeding.bind(this)}>
                            <View style={styles.horizontalAligner}>
                                <Text style={styles.timerTitle}>{timerText}</Text>
                                {feedingTimer}
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <View style={[styles.verticalAligner, styles.horizontalAligner]}>
                        <TouchableHighlight activeOpacity={0} onPress={(() => {this.handlePress.call(this, nursingMethods.left)}).bind(this)}>
                            <Text style={styles.button}>Left</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={[styles.verticalAligner, styles.horizontalAligner]}>
                        <TouchableHighlight activeOpacity={0} onPress={(() => {this.handlePress.call(this, nursingMethods.food)}).bind(this)}>
                            <Text style={styles.button}>Food</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={[styles.verticalAligner, styles.horizontalAligner]}>
                        <TouchableHighlight activeOpacity={0} onPress={(() => {this.handlePress.call(this, nursingMethods.bottle)}).bind(this)}>
                            <Text style={styles.button}>Bottle</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={[styles.verticalAligner, styles.horizontalAligner]}>
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
    verticalAligner: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    horizontalAligner: {
        alignItems: 'center'
    },
    feedingContainer: {
        padding: 4,
        flex: 1,
        flexDirection: 'row'
    },
    feedingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        padding: 4,
        paddingTop: 8
    },
    feedingTimes: {
        fontWeight: 'bold',
    },
    feedingDuration: {

    },
    timingTitle: {
        width: 100,
        textAlign: 'center',
        fontSize: 10,
    },
    flex3: {
        flex: 3
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