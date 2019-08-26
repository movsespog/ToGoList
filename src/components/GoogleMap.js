import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';


export default withScriptjs(withGoogleMap((props) => (
        <GoogleMap
            defaultZoom={16}
            defaultCenter={props.mapCenter}
            center={props.mapCenter}
            onClick={(e) => props.handleClick(e)}
        >
            {
                props.markers.map((marker) => {
                    return (
                        <MarkerWithLabel
                            key={marker.id}
                            position={marker.position}
                            labelAnchor={marker.labelAnchor}
                            labelStyle={{backgroundColor: "yellow", fontSize: "13px", padding: "5px"}}
                        >
                            <div>{marker.label}</div>
                        </MarkerWithLabel>
                    )
                })
            }
        </GoogleMap>
    )
))