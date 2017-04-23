/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Nurser from './src/nurser';

export default class nurser extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Nurser />
      </View>
    );
  }
}

AppRegistry.registerComponent('nurser', () => nurser);
