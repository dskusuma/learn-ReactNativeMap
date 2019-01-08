import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  callout: {
    width: 60,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  event: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 8,
  },
  eventData: {
    fontSize: 10,
    fontFamily: 'courier',
    color: '#555',
  },
  eventName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
  },
  eventList: {
    position: 'absolute',
    top: height / 3,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff'
  },
  formContainer: {
    position: 'absolute',
    height: 220,
    // top: 0,
    left: 10,
    right: 10,
    bottom: 10,
    backgroundColor: '#fff',
    borderRadius: 25,
    opacity: 0.95,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: {
      height: 0,
      width: 0
    },
    elevation: 1,
    padding: 10,
    paddingTop: 20,
    alignItems: 'center'
  },
  inputContainer : {
    borderColor: "#b2bec3",
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 5
  },
  inputLabelStyle: {
    fontSize: 13
  },
  inputCoordinateDetail: {
    fontSize: 12
  },
  inputButton: {
    marginTop: 15
  },
  keyboardAvoidingViewContainer: {
    width: '100%'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: height / 2,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
})

export default styles;