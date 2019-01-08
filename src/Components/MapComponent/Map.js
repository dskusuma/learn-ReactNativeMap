// Library Import
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  View,
  Text,
  Dimensions,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, ProviderPropType, Polygon, Polyline, Callout } from 'react-native-maps';
import { Input,Button } from 'react-native-elements'

// Component & Styles Import
import SilverMapStyle from '../../MapStyles/SilverMapStyle.json'
import styles from './styles'

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

class Map extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      markers: [],
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      events: [],
      addingPhase: false,
      draftMarker: {
        coordinate: '',
        key: '',
        status: '',
        placeName: '',
        address:''
      },
      draftPlaceName: '',
      draftAddress:''
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

  onMapPress(e) {
    console.log("this.state.addingPhase", this.state.addingPhase)
    if (this.state.addingPhase === false) {
      this.recordEvent('Map::onPress');
      console.log('draftMarker.coordinate: ', e.nativeEvent.coordinate)
      this.setState({
          draftMarker: {
            coordinate: e.nativeEvent.coordinate,
            key: id++,
            status: true,
          },
        addingPhase: true
      })
    } else {
      this.setState({
        addingPhase: false,
        draftMarker: {
          coordinate: '',
          key: '',
          status: false,
        },
      })
    } 
  }

  onAddButtonPress() {
    console.log("draftMarker.asdf", this.state.draftPlaceName);
    console.log("draftMarker.address", this.state.draftAddress);

    // add current draftMarker to markers array
    let markerObject = {
      coordinate: this.state.draftMarker.coordinate,
      key: id++,
      placeName: this.state.draftPlaceName,
      address: this.state.draftAddress
    }

    this.setState({
      markers: [
        ...this.state.markers,
        markerObject
      ],
    })

    // delete the current draft
    this.setState({
      addingPhase: false,
      draftMarker: {
        coordinate: '',
        key: '',
        status: '',
        placeName: '',
        address:''
      },
      draftPlaceName: '',
      draftAddress:''
    })
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
          onPress={(e) => {this.onMapPress(e)}}
          onPanDrag={this.recordEvent('Map::onPanDrag')}
          onLongPress={this.recordEvent('Map::onLongPress')}
          onMarkerPress={this.recordEvent('Map::onMarkerPress')}
          onMarkerSelect={this.recordEvent('Map::onMarkerSelect')}
          onMarkerDeselect={this.recordEvent('Map::onMarkerDeselect')}
          onCalloutPress={this.recordEvent('Map::onCalloutPress')}
          {...googleProviderProps}
        >
          {/* Render registered markers */}
          {this.state.markers.map( marker => (
            <Marker
              title="This is a title"
              description="This is a description"
              kye={marker.key}
              coordinate={marker.coordinate}
              onPress={this.recordEvent('Marker::onPress')}
              onSelect={this.recordEvent('Marker::onSelect')}
              onDeselect={this.recordEvent('Marker::onDeselect')}
              onCalloutPress={this.recordEvent('Marker::onCalloutPress')}
            >
              <Callout
                style={styles.callout}
                onPress={this.recordEvent('Callout::onPress')}
              >
                <View>
                  <Text>Name: {marker.placeName}</Text>
                  <Text>Address: {marker.address}</Text>
                </View>
              </Callout>
            </Marker>
          ))}

          {/* Render draft marker */}
          {this.state.draftMarker.status === true 
            ? 
            <Marker
              coordinate={this.state.draftMarker.coordinate}
            />
            :
            null
            }
        </MapView>
        {
          this.state.addingPhase ? 
            <View style={styles.formContainer}>
            
              <Input 
                placeholder="Place's name"
                leftIcon={{ type: 'font-awesome', name: 'home' , color: '#b2bec3'}}
                shake={true}
                onChangeText={(t) => {this.setState({draftPlaceName: t}) }}
                value={this.state.draftPlaceName}
                inputContainerStyle={styles.inputContainer}
                inputStyle={{
                  fontSize: 15
                }}
              />

              <Input 
                placeholder="Address' name"
                leftIcon={{ type: 'font-awesome', name: 'location-arrow' , color: '#b2bec3'}}
                shake={true}
                onChangeText={(t) => {this.setState({draftAddress: t}) }}
                value={this.state.draftAddress}
                inputContainerStyle={styles.inputContainer}
                inputStyle={{
                  fontSize: 15
                }}
              />

              <View >
                <Text style={styles.inputCoordinateDetail}>Lat: {this.state.draftMarker.coordinate.latitude}</Text>
                <Text style={styles.inputCoordinateDetail}>Long: {this.state.draftMarker.coordinate.longitude}</Text>
              </View>

              <Button
                title='ADD PLACE'
                buttonStyle={styles.inputButton}
                onPress={() => this.onAddButtonPress()}
              />
            </View>
          :
          null
        }
      </View>
      
    );
  }
}

Map.propTypes = {
  provider: ProviderPropType,
}

export default Map;