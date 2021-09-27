import React, { useEffect, useState } from 'react';
import {Map , GoogleApiWrapper , InfoWindow , Marker , MarkerCluster} from 'google-maps-react';
import {Typography} from '@material-ui/core';
import * as api from '../../api/api';

export function Maps({google , locations =[] , marker}) {

    const [newLocation , setNewLocation] = useState(locations)
    const [zoom , setZoom] = useState(4);
    const [center , setCenter] = useState(newLocation[0])

    const handleMarker = (coords) => {

        setZoom(4);

        for(let i = 0 ; i < newLocation.length ; i ++){
            
            if(newLocation[i] === coords){
            
                setCenter(newLocation[i]);
                setZoom(14);
            
                break;
            
            }else{
                continue;
            }
        }
    }

    useEffect(() => {

        async function poiCall(){
            
            let {data} = await api.poiAPI();
            
            for (let i = 0 ; i < data.length ; i ++){
                let lng = 'lng';
                data[i] = {...data[i] , [lng] : data[i].lon}
                delete data[i].lon
            }
            
            setNewLocation(data);
        }

        poiCall();

    },[])

    return (
        <div>
            <Typography component='h1' variant='h3' style={{marginTop:'1.5rem' , alignSelf:'center'}}>Map</Typography>
            <Map
            google={google}
            zoom={zoom}
            style={{width:'100%' , height:'70%'}}
            center={center}
            initialCenter={newLocation[0]} >
                {newLocation.map(
                    coords => <Marker 
                    position = {coords} 
                    onClick= {() => {handleMarker(coords)}}/>
                )}
            </Map>
          
        </div>
    )
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCNAZw3OZqID039-pPOFjTP-ToHsdIb_pk'
})(Maps);