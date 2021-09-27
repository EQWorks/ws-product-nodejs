import { Grid, Typography } from '@material-ui/core'
import React from 'react'
import {Link} from 'react-router-dom';


export default function Error404() {
    return (
        <div>
            <Grid container direction='column' spacing={3} alignItems='center' style={{marginTop:'1.5rem'}}>
                <Grid item xs={12}>
                    <Typography style={{fontSize:'40px' , color:'red' , fontWeight:'bolder'}}>Error 404: Page Not Found</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Link to='/' style={{color:`black`, fontSize:'20px' , cursor:'pointer' , textDecoration:'none' , fontWeight:'bold'}}>Return to HomePage</Link>
                </Grid>
            </Grid>
        </div>
    )
}
