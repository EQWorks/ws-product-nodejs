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
                    <Paper elevation={3} style={{marginLeft:'0.5rem' , backgroundColor:'darkgray'}}>
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
                        ].join(',') , fontSize:'1.5rem' , color:'aliceblue'}}>About Me</Typography>

                        <Typography variant='h6' style={{margin:'0.5rem' , color:'aliceblue'}}>
                            I would like to <strong>Thank You </strong>
                            for giving me this opportunity .
                        </Typography>

                        <Typography variant='body1' style={{fontFamily:'Cambria' , color:'aliceblue'}}>
                            Hi, My name is <strong>Akshat Gulati</strong>. I'll start by telling a bit about
                            my background. I am currently enrolled in 
                            <strong> University of Alberta</strong> under the degree program - <strong>
                            BSc (Bachelors of Science) Specialization</strong>. I am doing my major in 
                            <strong> Computing Science with specialization in Software Practice</strong>. 
                            I am currently in my<strong> 4th year </strong>.
                            <br />
                            <br />
                            I am very passionate about web development and aspire to become a 
                            Full Stack Developer. I have 4 projects under my belt, out of which
                            2 are my major projects through which I learned most of my technical skills.
                            I would like to tell you about my plus points, I am a good listener , 
                            punctual , hardworking , good at interacting with others and follow the deadlines.
                            <br />
                            <br />
                            I have some Extracurricular achievments as well. I have represented my University
                            as a part of the university cricket team. I have been a part of Student Council
                            as well.
                        </Typography>
                    </Paper>
                    <Paper elevation={3} style={{margin:'0.5rem' , backgroundColor:'aquamarine'}}>
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
                        ].join(',') , fontSize:'1.5rem'}}>Projects</Typography>
                        <Typography variant='body1' style={{fontFamily:'Cambria'}} >
                            <strong>1. Mechanical Turk Experiment Framework:</strong>
                            <br />
                            Jan21 - Apr21 (For Real Client)
                            <br />
                            <strong>Technical Skills Used:</strong>
                            <br />
                            Django , PostgreSQL , Socket.io , AWS Mturk API endpoints , HTML , CSS , 
                            JavaScript , Python Unit Testing
                            <br />
                            <strong>2. Puchh Puchh PetShop Website:</strong>
                            <br />
                            Oct20 - Present (For Real Client)
                            <br />
                            <strong>Technical Skills Used:</strong>
                            <br />
                            JavaScript , Reactjs , Nodejs , Express , Mongoose , MongoDb Atlas , MERN Stack , 
                            Redux 
                            <br />
                            <strong>3. YFinance Unit Testing :</strong>
                            <br />
                            Mar21 - Mar21 (Personal)
                            <br />
                            <strong>Technical Skills Used:</strong>
                            <br />
                            Python Unit Testing
                            <strong>3. S3 Database Query for IMDB :</strong>
                            <br />
                            Feb21 - Mar21 (Personal)
                            <br />
                            <strong>Technical Skills Used:</strong>
                            <br />
                            AWS S3 , SqlQuery , XML , XPath and XQuery
                    </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={3} style={{marginRight:'0.5rem' , backgroundColor:'aliceblue'}}>
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
                        ].join(',') , fontSize:'1.5rem'}}>How I can grow through this Internship</Typography>
                        <Typography variant='body1' style={{fontFamily:'Cambria'}} >
                            Being a part of this internship and working under an exceptional team will help me
                            get hands on experience in my field of interest,web development. Getting a
                            good understanding of how a company works and what is expected of me , early 
                            on in my career is something I look forward to achieve from this opportunity. I 
                            have had the privilege to work for two individual client prior to this, 
                            but being a part of a diverse team and working together is a skill I wish to
                            acquire.
                            <br />
                            <br />
                            I believe in learning throughout the course of this internship and hone not only
                            my technical but my interpersonal skills. I am quite acquainted with working  
                            under pressure and believe to be a good inclusion in your team . This internship
                            will be a great addition to my work experience.
 
                        </Typography>
                    </Paper>
                    <Paper elevation={3} style={{margin:'0.5rem' , backgroundColor:'cyan'}}>
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
                            ].join(',') , fontSize:'1.5rem'}}>Technical Skills</Typography>
                        <Typography variant='body1' style={{fontFamily:'Cambria'}} >
                                <strong>1. Programming Languages:</strong>
                                <br />
                                C, C++, Java, Python,vanilla
                                JavaScript, XQuery &amp; XPath,UML,SQL,Verilog,Assembly
                                Language,Agile Methodology(Scrums).
                                <br />
                                <strong>2.Tools:</strong>
                                <br />
                                MySQL,SQL PLUS , Postgresql(PgAdmin),AWS,XML,MongoDb atlas
                                <br />
                                <strong>3. Web Development Languages:</strong>
                                <br />
                                HTML(5) , CSS (3) , Django ,Bootstrap,React,Nodejs,Expressjs,MERN Stack,Redux
                        </Typography>
                    </Paper>
                    <Paper elevation={3} style={{margin:'0.5rem' , backgroundColor:'darkgoldenrod'}}>
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
                                ].join(',') , fontSize:'1.5rem'}}>Award and GPA :</Typography>
                        <Typography variant='body1' style={{fontFamily:'Cambria'}} >
                                <ul>
                                    <li>Joint Sports Secretary </li>
                                    <li>Current GPA : 3.1/4.0</li>    
                                </ul>
                        </Typography>
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
