import { Typography , Grid } from '@material-ui/core';
import React from 'react'

export default function Error429({location}) {
    
    return (
        
        <div>
            <Grid container direction='column' spacing={3} alignItems='center' style={{marginTop:'1.5rem'}}>
                <Grid item xs={12}>
                    <Typography style={{fontSize:'40px' , color:'red' , fontWeight:'bolder'}}>Error 429: Too Many Requests</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography  style={{color:`black`, fontSize:'20px' , fontWeight:'bold' }}>{location.state.data}</Typography>
                </Grid>
            </Grid>
        </div>
    )
}
