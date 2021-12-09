import aws from 'aws-sdk';
import { approotdir } from '../approotdir.js';

const config = aws.config.loadFromPath(approotdir + '/conf.json');
const ec2 = new aws.EC2(config);

const get_instance_id = (ip_addr) => {
    return new Promise((resolve, reject) => {
        ec2.describeNetworkInterfaces({
            Filters: [
                {
                    Name: 'addresses.private-ip-address',
                    Values: [ ip_addr.toString() ]
                }
            ]
        }, (err, data) => {
            if(err) reject(err.message);
            resolve(data.NetworkInterfaces[0].Attachment.InstanceId);
        })
    })
} 

export default async function get_id_from_ip(ip_addr) {
    return await get_instance_id(ip_addr);
}