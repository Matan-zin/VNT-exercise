export const time_period =  {
    '1h': 1,
    '3h': 3,
    '1d': 24,
    '3d': 24 * 3,
    '1w': 24 * 7,
    '3w': 24 * 7 * 3
};

export const period = {
    minutes: () => { // start from 5m with scale of 5m
        let arr = [12];
        for(let i = 0; i < 12; i++ ) arr[i] = ( 1 + i ) * 300;
        return arr;
    },
    hours: () => { // 1 hour
        let arr = [24];
        for(let i = 0; i < 24; i++ ) arr[i] = (1 + i) * 3600;
        return arr;
    },
};