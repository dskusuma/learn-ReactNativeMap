// Library Import
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  AppRegistry, 
  StyleSheet, 
  View,
  Text,
  Dimensions,
  ScrollView
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, ProviderPropType, Polygon, Polyline, Callout } from 'react-native-maps';

// Component & Styles Import
import SilverMapStyle from '../../MapStyles/SilverMapStyle.json'
import styles from './styles'
import PriceMarker from '../PriceMarkerComponent/PriceMarker'

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width/height;
// Initialization Map
const LATITUDE =  -6.976671;
const LONGITUDE =  107.633129;
const LATITUDE_DELTA= 0.09;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

class Event extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.event.id !== nextProps.event.id;
  }

  render() {
    const { event } = this.props;
    return (
      <View style={styles.event}>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.eventData}>{JSON.stringify(event.data, null, 2)}</Text>
      </View>
    )
  }
}

Event.PropTypes = {
  event: PropTypes.object,
}

export default class Map extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      events: [],
    }
  }

  makeEvent(e, name) {
    return {
      id: id++,
      name,
      data: e.nativeEvent ? e.nativeEvent: e,
    }
  }

  recordEvent(name) {
    return e => {
      if (e.persist) {
        e.persist()
      }
      this.setState(prevState => ({
        events: [
          this.makeEvent(e, name),
          ...prevState.events.slice(0,10),
        ]
      }));
    }
  }

  render() {
    let googleProviderProps = {};
    if (this.props.provider === PROVIDER_GOOGLE) {
      googleProviderProps = {
        onUserLocationChange: this.recordEvent('Map::onUserLocationChange'),
      }
    }

    return (
      <View style={styles.container}>
        <MapView 
          provider={PROVIDER_GOOGLE}
          style={styles.container}
          customMapStyle={SilverMapStyle}
          initialRegion={this.state.region}
          showsUserLocation
          showMyLocationButton
          onRegionChange={this.recordEvent('Map::onRegionChange')}
          onRegionChangeComplete={this.recordEvent('Map::onRegionChangeComplete')}
          onPress={this.recordEvent('Map::onPress')}
          onPanDrag={this.recordEvent('Map::onPanDrag')}
          onLongPress={this.recordEvent('Map::onLongPress')}
          onMarkerPress={this.recordEvent('Map::onMarkerPress')}
          onMarkerSelect={this.recordEvent('Map::onMarkerSelect')}
          onMarkerDeselect={this.recordEvent('Map::onMarkerDeselect')}
          onCalloutPress={this.recordEvent('Map::onCalloutPress')}
          {...googleProviderProps}
        >
          <Marker
            coordinate={{
              latitude: LATITUDE + (LATITUDE_DELTA / 2),
              longitude: LONGITUDE + (LONGITUDE_DELTA / 2),
            }}
          />
          <Marker
            coordinate={{
              latitude: LATITUDE - (LATITUDE_DELTA / 2),
              longitude: LONGITUDE - (LONGITUDE_DELTA / 2),
            }}
          />
          <Marker
            title="This is a title"
            description="This is a description"
            coordinate={this.state.region}
            onPress={this.recordEvent('Marker::onPress')}
            onSelect={this.recordEvent('Marker::onSelect')}
            onDeselect={this.recordEvent('Marker::onDeselect')}
            onCalloutPress={this.recordEvent('Marker::onCalloutPress')}
          >
            <PriceMarker amount={99} />
            <Callout
              style={styles.callout}
              onPress={this.recordEvent('Callout::onPress')}
            >
              <View>
                <Text>Well hello there...</Text>
              </View>
            </Callout>
          </Marker>
        </MapView>
        <View style={styles.eventList}>
          <ScrollView>
            {this.state.events.map(event => <Event key={event.id} event={event} />)}
          </ScrollView>
        </View>
      </View>
      
    );
  }
}

Map.propTypes = {
  provider: ProviderPropType,
}

 