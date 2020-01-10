import React from 'react';
import CanvasJSReact from './canvasjs.react';
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class HourlyEventsChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [], 
      type: '',
      clicks: []
    };
  }

  componentDidMount() {
    let type = this.props.type;
    this.setState({type: type});
    this.setState({data: this.props.data});
    console.log(this.state.type);
  }

  componentWillReceiveProps (prevProps) {
    if(this.props.data !== prevProps.data) {
      if (this.state.data.length < 1) {
        this.setState({data: prevProps.data});
      }
    }
  }

  render() {
    let first = this.state.data;
    const clicks = [];
    let revenue = [];

    for (let i = 0; i < first.length; i++) {
        clicks.push({x: first[i].date, y: parseInt(first[i].clicks) });
        revenue.push({x: first[i].date, y: first[i].revenue});
    }
    // this.setState({clicks: [...clicks]});

		const options = {
			animationEnabled: true,	
				title:{
					text: "Daily Events"
				},
				axisY : {
					title: "Number of Events",
					includeZero: false
        },
        axisX: {
          title: "Date"
        },
        toolTip: {
          shared: true
        },
        legend: {
          cursor: "pointer",
          itemclick: this.toggleDataSeries,
          verticalAlign: "top"
        },
        data: [{
          type: "spline",
          name: "Clicks",
          showInLegend: true,
      // xValueFormatString: "MMMM YYYY",
      // yValueFormatString: "$#,##0",
      dataPoints: clicks
    // },{
    //   type: "line",
    //   name: "Expected Sales",
    //   showInLegend: true,
    //   yValueFormatString: "$#,##0",
      
    // },{
    //   type: "area",
    //   name: "Revenue",
    //   markerBorderColor: "white",
    //   markerBorderThickness: 2,
    //   showInLegend: true,
    //   yValueFormatString: "$#,##0",
      // dataPoints: [
      //   { x: new Date(2017, 0), y: 11500 },
      //   { x: new Date(2017, 1), y: 10500 },
      //   { x: new Date(2017, 2), y: 9000 },
      //   { x: new Date(2017, 3), y: 13500 },
      //   { x: new Date(2017, 4), y: 13890 },
      //   { x: new Date(2017, 5), y: 18500 },
      //   { x: new Date(2017, 6), y: 16000 },
      //   { x: new Date(2017, 7), y: 14500 },
      //   { x: new Date(2017, 8), y: 15880 },
      //   { x: new Date(2017, 9), y: 24000 },
      //   { x: new Date(2017, 10), y: 31000 },
      //   { x: new Date(2017, 11), y: 19000 }
      // ]
    }]
  };
		return (
		<div>
			<CanvasJSChart options = {options}/>
		</div>
		);
  }
}