import React,{useEffect , useState} from 'react';
import * as api from '../../api/api';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import drilldown from 'highcharts/modules/drilldown';
import { Typography , Grid } from '@material-ui/core';
import moment from 'moment';
import './chart.css';
import _ from 'lodash';
import {Redirect} from 'react-router-dom';


export default function Chart() {
    
    const [dailyStat , setDailyStat] = useState([]);
    const [hourlyStat , setHourlyStat] = useState([]);
    const [dailyEvent , setDailyEvent] = useState([]);
    const [hourlyEvent , setHourlyEvent] = useState([]);
    const [dailyOptions , setDailyOptions] = useState({});
    const [hourlyOptions , setHourlyOptions] = useState({});
    const [dailyEventOptions , setDailyEventOptions] = useState({});
    const [hourlyEventOptions , setHourlyEventOptions] = useState({});
    
    const [error , setError] = useState(false);
    const [errorMessage , setErrorMessage] = useState('');

    useEffect(() => {
        if(!window.location.hash){
            window.location = window.location + '#loaded'; // Reloading the Page Because Highcharts.charts doesn't save data until caches
            window.location.reload();
        }

        async function statCallDaily () {
            
            try{

                let {data} = await api.dailyStatApi();
                setDailyStat(data);

            }catch(error){

                setErrorMessage(`${error.response.data}`);
                setError(true);

            }
        }

        async function statCallHourly () {

            try{

                let {data} = await api.hourlyStatApi();
                setHourlyStat(data);

            }catch(error){
             
                setErrorMessage(`${error.response.data}`);
                setError(true);

            }    
        }

        async function eventCallDaily () {
            try{
                let {data} = await api.dailyEventApi();
                setDailyEvent(data);
            
            }catch(error){

                setErrorMessage(`${error.response.data}`);
                setError(true);

            }
        }

        async function eventCallHourly () {
            try{

                let {data} = await api.hourlyEventApi();
                setHourlyEvent(data);

            }catch(error){

                setErrorMessage(`${error.response.data}`);
                setError(true);

            }
                
        }

        statCallDaily();
        statCallHourly();
        eventCallDaily();
        eventCallHourly();

    },[])

    drilldown(Highcharts)
    
    useEffect(() => {
        
        setDailyOptions({
            chart: {
                type: 'column',
                events: {
                    drilldown: function(e){

                        let filterValue = e.point.drilldown;
                        let dataArray = [];
                        
                        dailyStat.map(filter => {
    
                            if (filter.date === filterValue)
                                return dataArray.push(filter); 
                        })

                        let series;
                        
                        if(dataArray.length !== 0){
                            series = {
                                name: moment(dataArray[0].date).utc().format('MM/DD/YYYY'),
                                data:[['Clicks' , parseInt(dataArray[0].clicks , 10)] , ['Impressions' , parseInt(dataArray[0].impressions,10)] , ['Revenue' , parseFloat(dataArray[0].revenue,10)]]

                            }
                        }else{
                            series = {
                                name: moment(e.point.drilldown).utc().format('MM/DD/YYYY'),
                                data:[['Clicks' , 0] , ['Impressions' , 0] , ['Revenue' , 0]]
                            }
                        }

            
                        Highcharts.charts[0].addSeriesAsDrilldown(e.point , series)
                        Highcharts.charts[0].yAxis[0].setTitle({text : 'Total No of given Stats'});
                        
                    },
                    drillup: function(e){
                        Highcharts.charts[0].yAxis[0].setTitle({text : 'Total No of Stats'});
                    }
                },
            },
            title: {
                text: 'EQ Works Daily Stats (Click the Date/Column to View)'
            },
            xAxis:{
                type: 'category'    
            },
            yAxis: {
                type: 'logarithmic',
                title: {
                    text: 'Total No of Stats'
                }
            },
            series: [{
                name: 'Stats Daily',
                colorByPoint: true,
                data:
                    dailyStat.map(filter => {
                        return (
                            {
                                name: moment(filter.date).utc().format('MM/DD/YYYY'),
                                y: 4,
                                drilldown: filter.date
                            }
                            
                        )
                    })
                
            }],
        })
    },[dailyStat , setDailyOptions])

    useEffect(() => {

        let newFilter = new Set();
        let newHourFilter = new Set();

        hourlyStat.map(filter => {
            newFilter.add(filter.date);
            newHourFilter.add(filter.hour);
        });

        let newStat = Array.from(newFilter , v => ({['date']:`${v}`}));
        let newHourStat = Array.from(newHourFilter , v => ({['hour']:`${v}`}));

        let select = '';
        
        setHourlyOptions({
            chart: {
                type: 'column',
                events: {
                    drilldown: function(e){

                        let filterValue = e.point.drilldown;
                        let dataArray = [];
                        let newDataArray = [];

                        if (_.last(e.point.drilldown) !== 'Z' &&  _.last(e.point.drilldown) !== undefined){
                            hourlyStat.map(filter => {

                                if (filter.hour == filterValue)
                                    return dataArray.push(filter); 
                            });
                            
                            dataArray.map(filter =>{

                                if(filter.date === select)
                                    return newDataArray.push(filter) 
                            })

                            let series;

                            if (newDataArray.length !== 0){
                                series = {
                                    name: `${newDataArray[0].hour}`,
                                    data:[['Clicks' , newDataArray[0].clicks ] , ['Impressions' , newDataArray[0].impressions] , ['Revenue' , parseFloat(dataArray[0].revenue,10)]]
    
                                }
                            }else{
                                series = {
                                    name: `${e.point.drilldown}`,
                                    data:[['Clicks' , 0 ] , ['Impressions' , 0] , ['Revenue' , 0]]
    
                                }
                            }

                            Highcharts.charts[1].addSeriesAsDrilldown(e.point , series)
                            Highcharts.charts[1].yAxis[0].setTitle({text : 'Total Number of given Stats'});
                        }else{
                            Highcharts.charts[1].yAxis[0].setTitle({text : 'Total Types of Stats'});
                            select = e.point.drilldown;

                        }
                        
                    },
                    drillup: function(e) {
                        let message = e.target.yAxis[0].userOptions.title.text;

                        if(message === 'Total Number of given Stats'){
                            Highcharts.charts[1].yAxis[0].setTitle({text : 'Total Types of Stats'});
                        }else{
                            Highcharts.charts[1].yAxis[0].setTitle({text : 'Total No of Hours'});
                        }
                    }
                },
            },
            title: {
                text: 'EQ Works Hourly Stats (Click the Date/Column to View)'
            },
            xAxis:{
                type: 'category'    
            },
            yAxis: {
                type: 'logarithmic',
                title: {
                    text: 'Total No of Hours'
                }
            },
            series: [{
                name: 'Stats Hourly',
                colorByPoint: true,
                data:
                    newStat.map(filter => {    
                        return (
                            {
                                name: moment(filter.date).utc().format('MM/DD/YYYY'),
                                y: newHourStat.length,
                                drilldown: filter.date
                            }
                            
                        )
                    })
                
            }],
            drilldown : {
                series:
                    newStat.map(filters => {
                        return (
                            {
                                id:filters.date,
                                name:'Hours',
                                data: newHourStat.map(entry => {
                                    return(
                                        {
                                            name: `${entry.hour}hrs`,
                                            y: 4,
                                            drilldown: entry.hour
                                        }
                                    ) 
                                })
                            }
                        )
                    })
            }
        })
    },[hourlyStat])

    useEffect(() => {

        setDailyEventOptions({
            chart: {
                type: 'column',
                events: {
                    drilldown: function(e){

                        let filterValue = e.point.drilldown;
                        let dataArray = [];
                        
                        dailyEvent.map(filter => {
    
                            if (filter.date === filterValue)
                                return dataArray.push(filter); 
                        })

                        let series;
                        
                        if(dataArray.length !== 0){
                            series = {
                                name: moment(dataArray[0].date).utc().format('MM/DD/YYYY'),
                                data:[['Events', parseInt(dataArray[0].events)]]

                            }
                        }else{
                            series = {
                                name: moment(e.point.drilldown).utc().format('MM/DD/YYYY'),
                                data:[['Events' , 0]]
                            }
                        }

                        Highcharts.charts[2].addSeriesAsDrilldown(e.point , series)
                        Highcharts.charts[2].yAxis[0].setTitle({text : 'Total Number of Events'});
                    },
                    drillup: function(e) {
                        Highcharts.charts[2].yAxis[0].setTitle({text : 'Total Types of Event Stat'});
                    }
                },
            },
            title: {
                text: 'EQ Works Daily Events (Click the Date/Column to View)'
            },
            xAxis:{
                type: 'category'    
            },
            yAxis: {
                type: 'logarithmic',
                title: {
                    text: 'Total Types of Event Stat'
                }
            },
            series: [{
                name: 'Events Daily',
                colorByPoint: true,
                data:
                    dailyEvent.map(filter => {
                        return (
                            {
                                name: moment(filter.date).utc().format('MM/DD/YYYY'),
                                y: 1,
                                drilldown: filter.date
                            }
                            
                        )
                    })
                
            }],
        })
    },[dailyEvent]);

    useEffect(() => {

        let newFilter = new Set();
        let newHourFilter = new Set();

        hourlyEvent.map(filter => {
            newFilter.add(filter.date);
            newHourFilter.add(filter.hour);
        });

        let newStat = Array.from(newFilter , v => ({['date']:`${v}`}));
        let newHourStat = Array.from(newHourFilter , v => ({['hour']:`${v}`}));

        let select = '';
        
        setHourlyEventOptions({
            chart: {
                type: 'column',
                events: {
                    drilldown: function(e){

                        let filterValue = e.point.drilldown;
                        let dataArray = [];
                        let newDataArray = [];

                        if (_.last(e.point.drilldown) !== 'Z' &&  _.last(e.point.drilldown) !== undefined){
                            hourlyEvent.map(filter => {

                                if (filter.hour == filterValue)
                                    return dataArray.push(filter); 
                            });
                            
                            dataArray.map(filter =>{

                                if(filter.date === select)
                                    return newDataArray.push(filter) 
                            })

                            let series;

                            if (newDataArray.length !== 0){
                                console.log(newDataArray)
                                series = {
                                    name: `${newDataArray[0].hour} hrs`,
                                    data:[['Events' , newDataArray[0].events]]
    
                                }
                            }else{
                                series = {
                                    name: `${e.point.drilldown} hrs`,
                                    data:[['Events' , 0 ]]
    
                                }
                            }

                            Highcharts.charts[3].addSeriesAsDrilldown(e.point , series)
                            Highcharts.charts[3].yAxis[0].setTitle({text : 'Total Number of Events'})
                            
                        }else{

                            Highcharts.charts[3].yAxis[0].setTitle({text : 'Total Event Stat'});
                            select = e.point.drilldown;

                        }
                        
                    },
                    drillup: function(e) {

                        let message = e.target.yAxis[0].userOptions.title.text
                        
                        if(message === 'Total Number of Events'){
                            Highcharts.charts[3].yAxis[0].setTitle({text : 'Total Event Stat'});
                        }else {
                            Highcharts.charts[3].yAxis[0].setTitle({text : 'Total Types of Hours'});
                        }
                        
                    }
                },
            },
            title: {
                text: 'EQ Works Hourly Events (Click the Date/Column to View)'
            },
            xAxis:{
                type: 'category'    
            },
            yAxis: {
                type: 'logarithmic',
                title: {
                    text: 'Total type of Hours'
                }
            },
            series: [{
                name: 'Events Hourly',
                colorByPoint: true,
                data:
                    newStat.map(filter => {    
                        return (
                            {
                                name: moment(filter.date).utc().format('MM/DD/YYYY'),
                                y: newHourStat.length,
                                drilldown: filter.date
                            }
                            
                        )
                    })
                
            }],
            drilldown : {
                series:
                    newStat.map(filters => {
                        return (
                            {
                                id:filters.date,
                                name:'Hours',
                                data: newHourStat.map(entry => {
                                    return(
                                        {
                                            name: `${entry.hour}hrs`,
                                            y: 1,
                                            drilldown: entry.hour
                                        }
                                    ) 
                                })
                            }
                        )
                    })
            }
        })
    },[hourlyEvent]);
     
    return (
        <div className='chart'>
            <Grid container direction='row' alignItems='center' spacing={4} style={{marginTop:'1.5rem'}}>
                <Grid item xs={12}>
                    <Typography component='h1' variant='h3'>EQ Works Charts</Typography>
                </Grid>
                <Grid item xs={6}>
                    <HighchartsReact highcharts={Highcharts} options={dailyOptions} />
                </Grid>
                <Grid item xs={6}>
                    <HighchartsReact highcharts={Highcharts} options={hourlyOptions}/>
                </Grid>
                <Grid item xs={12}>
                    <HighchartsReact highcharts={Highcharts} options={dailyEventOptions} />
                </Grid>
                <Grid item xs={12}>
                    <HighchartsReact highcharts={Highcharts} options={hourlyEventOptions}/>
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


