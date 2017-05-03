
import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, TouchableHighlight, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { nursingMethods } from './utils/config';
import Feeding from './components/Feeding';
import FeedingTimer from './components/FeedingTimer';

import * as actionCreators from './redux/actionCreators';

import { saveItem, getItem } from './utils/storage';

class Nurser extends Component {

    constructor() {
        super();
    }
    _startFeeding(method) {
        this.props.startFeeding(method);
    }

    _endFeeding(){
        this.props.stopFeeding();
    }

    handlePress(side){
        if(this.props.timing){
            this._endFeeding();
        } else {
            this._startFeeding(side);
        }
    }

    deleteFeeding(index){
        this.props.deleteFeeding(index);
    }

    render() {
        var feedings = [];
        let month = null;
        let day = null;
        let feedingArray = this.props.feedings.slice(0);
        if(this.props.timing){
            feedingArray.push({
                method: this.props.currentMethod,
                start: this.props.start,
                end: null,
                length: null,
                noDelete: true,
            });
        }
        for(var i = feedingArray.length-1; i>= 0; i--){
            var currentFeeding = feedingArray[i];
            if((!month || !day) || (currentFeeding.start.getMonth() < month || currentFeeding.start.getDate() < day)){
                month = currentFeeding.start.getMonth();
                day = currentFeeding.start.getDate();
                feedings.push(<Text key={'title'+currentFeeding.start.toISOString()} style={styles.feedingTitle}>{currentFeeding.start.getMonth()+1}/{currentFeeding.start.getDate()}</Text>);
            }
            feedings.push(<Feeding id={i} delete={this.deleteFeeding.bind(this)} key={currentFeeding.start.toISOString()} feeding={currentFeeding} />);
        }

        let feedingTimer = null,
            timerText = '';
        if(this.props.timing){
            timerText = 'Current feeding';
            feedingTimer = <FeedingTimer active={this.props.timing} current={this.props.start} />;
        } else if (this.props.feedings.length > 0){
            timerText = 'Time since last feeding';
            feedingTimer = <FeedingTimer active={this.props.timing} current={this.props.feedings.slice(-1)[0].end} />;
        } else {
            timerText = 'Start feeding';
            feedingTimer = <FeedingTimer active={this.props.timing} current={null} />;
        }
        let buttonContainer;
        if(this.props.timing){
            buttonContainer = (
                <View style={styles.buttonContainer}>
                    <View style={[styles.verticalAligner, styles.horizontalAligner]}>
                        <TouchableHighlight underlayColor={'transparent'} onPress={this._endFeeding.bind(this)}>
                            <Text style={styles.button}>Stop</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            )
        } else {
            buttonContainer = (
                <View style={styles.buttonContainer}>
                    <View style={[styles.verticalAligner, styles.horizontalAligner]}>
                        <TouchableHighlight underlayColor={'transparent'} onPress={(() => {this.handlePress.call(this, nursingMethods.left)}).bind(this)}>
                            <Text style={styles.button}>Left</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={[styles.verticalAligner, styles.horizontalAligner]}>
                        <TouchableHighlight underlayColor={'transparent'} onPress={(() => {this.handlePress.call(this, nursingMethods.food)}).bind(this)}>
                            <Text style={styles.button}>Food</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={[styles.verticalAligner, styles.horizontalAligner]}>
                        <TouchableHighlight underlayColor={'transparent'} onPress={(() => {this.handlePress.call(this, nursingMethods.bottle)}).bind(this)}>
                            <Text style={styles.button}>Bottle</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={[styles.verticalAligner, styles.horizontalAligner]}>
                        <TouchableHighlight underlayColor={'transparent'} onPress={(() => {this.handlePress.call(this, nursingMethods.right)}).bind(this)}>
                            <Text style={styles.button}>Right</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            );
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
                {buttonContainer}
            </View>
        );
    }
}

function mapStateToProps(state, ownProps){
    return {
        feedings: state.feedings,
        currentMethod: state.currentMethod,
        start: state.start,
        timing: state.timing,
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Nurser);

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
    feedingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        padding: 4,
        paddingTop: 8
    },
    timingTitle: {
        width: 100,
        textAlign: 'center',
        fontSize: 10,
    },
    button: {
        width: 60,
        height: 60,
        textAlign: 'center',
        lineHeight: 38,
        backgroundColor: 'white',
        borderRadius: 30,
    },
})