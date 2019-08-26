import React, { Component } from 'react';
import GoogleMap from './GoogleMap';
import Modal from 'react-modal';
import Places from './Places';
import shortID from 'short-id-gen';
import config from '../config';
import '../App.css';

class App extends Component {
    constructor(props){
        super(props);

        //binding methods
        this.handleClick = this.handleClick.bind(this);
        this.onModalInputChange = this.onModalInputChange.bind(this);
        this.confirmAddPlace = this.confirmAddPlace.bind(this);
        this.cancelAddPlace = this.cancelAddPlace.bind(this);
        this.goToLocation = this.goToLocation.bind(this);
        this.removePlace = this.removePlace.bind(this);
        this.markAsVisited = this.markAsVisited.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);

        this.state = {
            markers: [],
            modalIsOpen: false,
            modalInputValue: '',
            filterValue: '',
            currentMarkerID: null,
            mapCenter: {
                lat: 40.17956771440295,
                lng: 44.51704104658768
            }
        }
    }

    //handler for map click. Getting latitude and longitude from the event object,
    //generating current markerID and keeping it in state for future reference when will be adding label to it
    handleClick(e) {
        const lat = e.latLng.lat(),
            lng = e.latLng.lng(),
            markerID = shortID.generate();

        this.setState( {
            currentMarkerID: markerID,
            modalIsOpen: true,
            markers: [
                ...this.state.markers,
                {
                    id: markerID,
                    label: '',
                    position: { lat, lng },
                    labelAnchor: new window.google.maps.Point(0, 60),
                    isVisited: false
                }
            ]
        });
    }

    //handler for confirming the place add. Here I'm getting the marker by it's id, making changes to it
    //after setting state with new updated marker and rest of other markers
    confirmAddPlace() {
        const currentMarker = this.state.markers.filter(marker => marker.id === this.state.currentMarkerID)[0];
        const otherMarkers = this.state.markers.filter(marker => marker.id !== this.state.currentMarkerID);
        const updatedMarker = Object.assign({}, currentMarker, {label: this.state.modalInputValue});
        this.setState({
            currentMarkerID: null,
            modalInputValue: '',
            modalIsOpen: false,
            markers: [
                ...otherMarkers,
                updatedMarker
            ]
        });
    }

    //by canceling add place I'm just filtering current marker from the state object
    //then closing modal and resetting the input value and markerID
    cancelAddPlace() {
        const filteredMarkers = this.state.markers.filter(marker => marker.id !== this.state.currentMarkerID);
        this.setState({
            modalIsOpen: false,
            currentMarkerID: null,
            modalInputValue: '',
            markers: [
                ...filteredMarkers
            ]
        })
    }

    //controlling modal input and keeping it in state for setting it as a label in current marker
    onModalInputChange(e) {
        const inputValue = e.target.value;
        this.setState({
            modalInputValue: inputValue
        })
    }

    //handler for going to selected location
    goToLocation(e, position) {
        this.setState({
            mapCenter: {
                lat: position.lat,
                lng: position.lng
            }
        })
    }

    //handler for removing a selected place
    removePlace(e, markerID) {
        const filteredMarkers = this.state.markers.filter(marker => marker.id !== markerID);
        this.setState({
            markers: [
                ...filteredMarkers
            ]
        })
    }

    //handler for marking place as visited
    markAsVisited(e, markerID) {
        const filteredMarkers = this.state.markers.filter(marker => marker.id !== markerID);
        const currentMarker = this.state.markers.filter(marker => marker.id === markerID)[0];
        const updatedMarker = Object.assign({}, currentMarker, {isVisited: true});

        this.setState({
            markers: [
                ...filteredMarkers,
                updatedMarker
            ]
        })
    }

    //handler for filtering places
    onFilterChange(e){
        this.setState({
            filterValue: e.target.value
        })
    }

    //Setting App element to modal for avoiding warnings. That should have been default
    //however there is some kind of bug in the lib right now, github issue was opened
    componentWillMount() {
        Modal.setAppElement('body');
    }

    render() {
        return (
            <div className="app">
                <h2>ToGo List App</h2>
                <div className="app-content">
                    <div className="app-grid-item">
                        <GoogleMap
                            googleMapURL={config.mapConfig.googleMapURL}
                            loadingElement={<div style={config.stylesConfig.loadingElement} />}
                            containerElement={<div style={config.stylesConfig.containerElement} />}
                            mapElement={<div style={config.stylesConfig.mapElement} />}
                            handleClick={this.handleClick}
                            markers={this.state.markers}
                            mapCenter={this.state.mapCenter}
                        />
                    </div>
                    <div className="app-grid-item places">
                        <Places
                            markers={this.state.markers}
                            goToLocation={this.goToLocation}
                            removePlace={this.removePlace}
                            markAsVisited={this.markAsVisited}
                            onFilterChange={this.onFilterChange}
                            filterValue={this.state.filterValue}
                        />
                    </div>

                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    style={config.stylesConfig.modalCustomStyles}
                    contentLabel="Places Modal"
                >
                    <h4>Name Your selected place</h4>
                    <input type="text" onChange={this.onModalInputChange} value={this.state.modalInputValue}/>
                    <button className="confirm" onClick={this.confirmAddPlace}>Confirm</button>
                    <button className="cancel" onClick={this.cancelAddPlace}>Cancel</button>
                </Modal>
            </div>
        )
    }
}

export default App;

