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
import { Provider } from 'react-redux';
import Nurser from './src/nurser';
import Store from './src/createStore';

export default class nurser extends Component {
  render() {
    return (
      <Provider store={Store}>
        <View style={{flex: 1}}>
          <Nurser />
        </View>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('nurser', () => nurser);
