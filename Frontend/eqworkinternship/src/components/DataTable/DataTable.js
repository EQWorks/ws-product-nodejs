import React , {useEffect , useState} from 'react';
import { Typography , Grid } from '@material-ui/core';
import {DataGrid , GridToolbarContainer , GridToolbarFilterButton } from '@mui/x-data-grid';
import * as api from '../../api/api';
import './data.css';
import moment from 'moment'

export default function DataTable() {
    
    const [rowEvent , setRowEvent] = useState([]);
    const [rowStat , setRowStat] = useState([]);
    const [statPageSize , setStatPageSize] = useState(5);
    const [eventPageSize , setEventPageSize] = useState(5);
    const [statHeight , setStatHeight] = useState('450px')
    const [eventHeight , setEventHeight] = useState('450px')

    const statColumn = [
        {
            field: 'date',
            headerName: 'Date',
            width: 130
        },
        {
            field: 'poi_name',
            headerName: 'Name' ,
            width: 300
        },
        {
            field: 'clicks',
            headerName: 'Clicks',
            width: 200
        },
        {
            field: 'hour',
            headerName: 'Hour',
            width: 200
        },
        {
            field: 'impressions',
            headerName: 'Impressions',
            width: 200
        },
        {
            field: 'revenue',
            headerName: 'Revenue',
            width: 220
        }
    ]

    const eventColumn = [
        {
            field:'date',
            headerName:'Date',
            width: 300
        },
        {
            field:'poi_name',
            headerName:'Name',
            width: 300
        },
        {
            field:'hour',
            headerName:'Hour',
            width:300
        },
        {
            field:'events',
            headerName:'Events',
            width:300
        }
    ]

    useEffect(() => {

        async function statHourlyCall(){

            let [message1,message2] = await Promise.all([(await api.hourlyStatDataTableApi()).data , (await api.poiAPI()).data]);

            for(let i = 0 ; i < message1.length ; i++){

                message1[i].id = i;

                for(let j =0 ; j < message2.length ; j++){
                    
                    if(message1[i].poi_id === message2[j].poi_id){

                        message1[i].date = moment(message1[i].date).utc().format('MM/DD/YYYY');
                        message1[i].poi_name = message2[j].name;        
                        break;

                    }else{

                        continue;
                        
                    }
                }
            }
            console.log(message1);
            setRowStat(message1);
        }

        async function eventHourlyCall(){

            let [message1,message2] = await Promise.all([(await api.hourlyEventDataTableApi()).data , (await api.poiAPI()).data]);

            for(let i = 0 ; i < message1.length ; i++){
                
                message1[i].id = i;

                for(let j =0 ; j < message2.length ; j++){
                    
                    if(message1[i].poi_id === message2[j].poi_id){

                        message1[i].date = moment(message1[i].date).utc().format('MM/DD/YYYY');
                        message1[i].poi_name = message2[j].name;        
                        break;
                    }else{

                        continue;

                    }
                }
            }
            console.log('CHECKING NEW DATA :' , message1)
            setRowEvent(message1);
        }

        statHourlyCall();
        eventHourlyCall();

    },[])

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer style={{display:'flex',justifyContent:'center'}}>
                <GridToolbarFilterButton 
                style={{color: 'black' , fontWeight:'bolder' , fontSize:'20px'}}/>
                
            </GridToolbarContainer>
        )
    }

    return (
        <div className='data-table' >
            <Grid container direction='row' alignItems='center' spacing={3} style={{marginTop:'1.5rem'}}>
                <Grid item xs={12}>
                    <Typography component='h1' variant='h3'>Data Table</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography style={{fontWeight:'bolder' , fontSize:'large'}}>Stat Table</Typography>
                </Grid>
                <Grid item xs={12} style={{height:`${statHeight}` , width: '100%'}}>
                    <DataGrid 
                        rows={rowStat} 
                        columns={statColumn}
                        pageSize ={statPageSize}
                        onPageSizeChange = {(newPageSize) => {
                            setStatPageSize(newPageSize)
                            if(newPageSize === 10){
                                setStatHeight('690px')
                            }else if(newPageSize === 25){
                                setStatHeight('1480px')
                            }else{
                                setStatHeight('450px')
                            }}}
                        rowsPerPageOptions= {[5 , 10 , 25]}
                        pagination
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography style={{fontWeight: 'bolder' , fontSize:'large'}}>Event Table</Typography>
                </Grid>
                <Grid item xs={12} style={{height:`${eventHeight}` , width: '100%'}}>
                    <DataGrid 
                        rows={rowEvent} 
                        columns={eventColumn}
                        pageSize ={eventPageSize}
                        onPageSizeChange = {(newPageSize) => {
                            setEventPageSize(newPageSize)
                            if(newPageSize === 10){
                                setEventHeight('690px')
                            }else if(newPageSize === 25){
                                setEventHeight('1480px')
                            }else{
                                setEventHeight('450px')
                            }}}
                        rowsPerPageOptions= {[5 , 10 , 25]}
                        pagination
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    )
}
