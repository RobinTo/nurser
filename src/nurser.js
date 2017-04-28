
import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, TouchableHighlight, AsyncStorage } from 'react-native';
import { nursingMethods } from './utils/config';
import Feeding from './components/Feeding';
import FeedingTimer from './components/FeedingTimer';

export default class Nurser extends Component {

    constructor() {
        super();
        this.state = {
            timing: false,
            currentMethod: null,
            feedings: []
        };
    }

    componentDidMount(){
        AsyncStorage.getItem('@NurserStore:feedings', (err, res) => {
            if(err){
                console.log('Error while loading data.');
                return;
            }
            if(!res){
                console.log('No data was loaded.');
                return;
            }
            let myFeedings = JSON.parse(res);

            // Parse dates into date objects again.
            for(var i = 0; i < myFeedings.length; i++){
                myFeedings[i].start = new Date(myFeedings[i].start);
                myFeedings[i].end = new Date(myFeedings[i].end);
            }

            this.setState({
                feedings: myFeedings
            });
            console.log('Loaded feedings successfully');
        });
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
        let newFeedings = this.state.feedings.slice(0);
        newFeedings.push(feeding);
        this.setState({
            timing: false,
            start: null,
            currentMethod: null,
            feedings: newFeedings
        });
        this._saveFeedings(newFeedings);
    }

    _saveFeedings(feedings=this.state.feedings){
        AsyncStorage.setItem('@NurserStore:feedings', JSON.stringify(feedings), (err) => {
            if(err){
                console.log('Error saving feedings data.');
                return;
            }
            console.log('Data saved');
        });
    }

    handlePress(side){
        if(this.state.timing){
            this._endFeeding();
        } else {
            this._startFeeding(side);
        }
    }

    deleteFeeding(index){
        console.log('Trying to delete at index', index);
        let newFeedings = this.state.feedings.slice(0);
        newFeedings.splice(index, 1);
        this.setState({
            feedings: newFeedings
        });
        this._saveFeedings(newFeedings);
    }

    render() {
        var feedings = [];
        let month = -1;
        let day = -1;
        let feedingArray = this.state.feedings.slice(0);
        if(this.state.timing){
            feedingArray.push({
                method: this.state.currentMethod,
                start: this.state.start,
                end: null,
                length: null
            });
        }
        for(var i = feedingArray.length-1; i>= 0; i--){
            var currentFeeding = feedingArray[i];
            if(currentFeeding.start.getMonth() > month || currentFeeding.start.getDate() > day){
                month = currentFeeding.start.getMonth();
                day = currentFeeding.start.getDate();
                feedings.push(<Text key={currentFeeding.start.toString()} style={styles.feedingTitle}>{currentFeeding.start.getMonth()+1}/{currentFeeding.start.getDate()}</Text>);
            }
            feedings.push(<Feeding id={this.state.timing ? i-1 : i} delete={this.deleteFeeding.bind(this)} key={i+currentFeeding.start.toString()} feeding={currentFeeding} />);
        }

        let feedingTimer = null,
            timerText = '';
        if(this.state.timing){
            timerText = 'Current feeding';
            feedingTimer = <FeedingTimer active={this.state.timing} current={this.state.start} />;
        } else if (this.state.feedings.length > 0){
            timerText = 'Time since last feeding';
            feedingTimer = <FeedingTimer active={this.state.timing} current={this.state.feedings.slice(-1)[0].end} />;
        } else {
            timerText = 'Start feeding';
            feedingTimer = <FeedingTimer active={this.state.timing} current={null} />;
        }
        let buttonContainer;
        if(this.state.timing){
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