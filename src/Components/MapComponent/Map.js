// Library Import
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

// Component & Styles Import
import SilverMapStyle from '../../MapStyles/SilverMapStyle.json'
import styles from './styles'

export default class Map extends React.PureComponent {
  render() {
    return (
      <MapView 
        provider = { PROVIDER_GOOGLE }
        style = { styles.container }
        customMapStyle = { SilverMapStyle }
        initialRegion = {{
          latitude: -6.976671,
          longitude: 107.633129,
          latitudeDelta: 0.09,
          longitudeDelta: 0.05,
        }}
      />
    );
  }
}

 