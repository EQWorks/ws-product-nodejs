import React, {useEffect , useState} from 'react'
import * as api from '../../api/api'
import {Typography , Grid} from '@material-ui/core'
export default function Home() {

    const [welcomeCall , setWelcomeCall] = useState('')

    useEffect(() => {    
        
        async function headingCall() {

            let {data} = await api.welcomeApi();
            setWelcomeCall(data);  
        }

        headingCall();
    },[])

    return (
        <div style={{ overflow:'hidden'}}>
            <Grid container direction='column' alignItems='center' spacing={2} style={{marginTop:'1.5rem'}}>
                <Grid item xs={12}>
                    <Typography component='h1' variant='h3'>{welcomeCall}</Typography>
                </Grid>
            </Grid>
        </div>
    )
}
