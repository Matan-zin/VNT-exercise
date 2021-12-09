import aws from 'aws-sdk';
import * as AWS from '@aws-sdk/client-cloudwatch';
import { sub, format } from 'date-fns';
import get_id_from_ip from './get_id_from_ip.js';
import { approotdir } from '../approotdir.js';


const config = aws.config.loadFromPath(approotdir + '/conf.json');
const cloud_client = new AWS.CloudWatchClient(config);


const req_params = (req) => {
    return {
        period:      req.body.data.period,
        time_period: req.body.data.time_period,
        ip_address:  req.body.data.ip_address,
        statistics:  req.body.data.statistics
    }
};

const orgenaize_data = (sorted_array) => {
    const size = sorted_array.length;
    let labels = [size], maximum = [size], minimum = [size], average = [size];
    for(let i = 0; i < size; i++) {
        labels[i] = format(sorted_array[i]['Timestamp'], 'aaa:hh:mm'); // AM PM
        if(sorted_array[i]['Maximum']) maximum[i] = sorted_array[i]['Maximum'];
        if(sorted_array[i]['Average']) average[i] = sorted_array[i]['Average'];
        if(sorted_array[i]['Minimum']) minimum[i] = sorted_array[i]['Minimum'];
    }

    const dataset = [
        sorted_array[0]['Maximum'] && { label: 'Maximum', data: maximum, fill: false, borderColor: 'rgb(158, 31, 31)', tension: 0.1 },
        sorted_array[0]['Minimum'] && { label: 'Minimum', data: minimum, fill: false, borderColor: 'rgb(53, 141, 255)', tension: 0.1 },
        sorted_array[0]['Average'] && { label: 'Average', data: average, fill: false, borderColor: 'rgb(54, 161, 72)', tension: 0.1 },
    ]

    return  {
        labels: labels,
        datasets: dataset.filter(Boolean)
    }
};

export default async function get_cpu_usage(req) {
    
    const params = req_params(req);
    const end    = new Date();
    const start  = sub(end, { hours: params.time_period });
    const aws_params = {
        StartTime: start,
        EndTime: end,
        MetricName: 'CPUUtilization',
        Namespace: 'AWS/EC2',
        Period: params.period,
        Dimensions: [{
            Name: 'InstanceId',
            Value: await get_id_from_ip(params.ip_address)
        }],
        Statistics: params.statistics
    }
        const data = await cloud_client.send(new AWS.GetMetricStatisticsCommand(aws_params));
        const sorted_array = data.Datapoints.sort((x,y) => x.Timestamp.getTime() - y.Timestamp.getTime());
        return orgenaize_data(sorted_array);
}