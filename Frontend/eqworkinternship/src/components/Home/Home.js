import React, {useEffect , useState} from 'react'
import * as api from '../../api/api'
import {Typography , Grid , Paper} from '@material-ui/core'
import { Redirect } from 'react-router-dom'
export default function Home() {

    const [welcomeCall , setWelcomeCall] = useState('');
    const [error , setError] = useState(false);
    const [errorMessage , setErrorMessage] = useState('');

    useEffect(() => {    
        
        async function headingCall() {

            try{
                let {data} = await api.welcomeApi();
                setWelcomeCall(data);
            }catch(error){
        
               setErrorMessage(`${error.response.data}`);
               setError(true);
        
            }  
        }

        headingCall();
    },[])

    return (
        <div style={{ overflow:'hidden'}}>
            <Grid container direction='row' alignItems='center' spacing={3} style={{marginTop:'1.5rem'}}>
                <Grid item xs={12}>
                    <Typography component='h1' variant='h3'>{welcomeCall}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Paper>
                        <Typography style={{fontWeight:'bold',fontFamily: [
                            '-apple-system',
                            'BlinkMacSystemFont',
                            '"Segoe UI"',
                            'Roboto',
                            '"Helvetica Neue"',
                            'Arial',
                            'sans-serif',
                            '"Apple Color Emoji"',
                            '"Segoe UI Emoji"',
                            '"Segoe UI Symbol"',
                        ].join(',') , fontSize:'1.5rem'}}>About Me</Typography>
                    </Paper>
                </Grid>
            </Grid>
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
