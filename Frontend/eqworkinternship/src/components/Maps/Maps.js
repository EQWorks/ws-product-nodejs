import React, { useEffect, useState } from 'react';
import {Map , GoogleApiWrapper , InfoWindow , Marker , MarkerCluster} from 'google-maps-react';
import {Typography} from '@material-ui/core';
import * as api from '../../api/api';
import {Redirect} from 'react-router-dom';

export function Maps({google , locations =[] , marker}) {

    const [newLocation , setNewLocation] = useState(locations)
    const [zoom , setZoom] = useState(4);
    const [center , setCenter] = useState(newLocation[0])

    const [error , setError] = useState(false);
    const [errorMessage , setErrorMessage] = useState('');

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
            
            try{
                let {data} = await api.poiAPI();
            
                for (let i = 0 ; i < data.length ; i ++){
                    let lng = 'lng';
                    data[i] = {...data[i] , [lng] : data[i].lon}
                    delete data[i].lon
                }
            
                setNewLocation(data);

            }catch(error){

                setErrorMessage(`${error.response.data}`);
                setError(true);

            }
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
            {error && (
                 <Redirect to ={{
                    pathname:'/toomanyrequests',
                    state:{data : errorMessage }
                }} />
            )
                
            }
        </div>
    )
}

export default GoogleApiWrapper({
    apiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`
})(Maps);