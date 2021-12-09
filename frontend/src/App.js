import 'chart.js/auto';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';


import './App.css';
import { period, time_period } from './utils/period_data';
import { HOUR, MINUTE, ONE_DAY, STATISTICS, PARAMS } from './constants/constants';


export default function App() {

  const [ data,               set_data ]               = useState(PARAMS)
  const [ char_data,          set_char_data ]          = useState(null);
  const [ ip_address,         set_ip_address ]         = useState('172.31.74.202');
  const [ statistics,         set_statistics ]         = useState([STATISTICS[0]])
  const [ period_option,      set_period_option ]      = useState(period.minutes()[0]);
  const [ time_period_option, set_time_period_option ] = useState(time_period['1h']);


  useEffect(() => {
    (async () => {
      const result = await axios.post(`/backend/cpu-usage`, { data });
      set_char_data(result.data)
    })();
  }, [data]);


  
  const handle_submit = (event) => {
    event.preventDefault();
    set_data({
      period: period_option,
      time_period: time_period_option,
      ip_address: ip_address,
      statistics: statistics
    })
  };

  const unit = time_period_option < ONE_DAY ? 'minutes' : 'hours';

  return (
    <> { !char_data ? <p>Loading..</p> 
                   : <div className="cpu-usage-page">
      <h2>AWS Instance CPU Usage</h2>

      <form onSubmit={handle_submit}>

      <div className="time-period-wrraper">
      <label htmlFor="time-period">Time Period:</label>
      <select
          name="time-period"
          onClick={({ target }) => { 
                      if(target.value >= ONE_DAY && time_period_option < ONE_DAY) set_period_option(HOUR);
                      if(target.value < ONE_DAY && period_option >= HOUR) set_period_option(300); // 5 minute
                      set_time_period_option(target.value)
                      }}>
      { Object.entries(time_period).map(([key, value], index) => {
        return <option key={index} value={value}>{key}</option>
      })}
      </select>
      </div>

      <div className="period-wrraper">
      <label htmlFor="period">Period: <span>{unit}</span></label>
      <select name="period" onClick={({ target }) => set_period_option(target.value)}>
      { time_period_option < ONE_DAY 
              ? <> { 
                period.minutes().map((value, index) => {
                  return <option key={index} value={value}>{value / MINUTE}</option> })}
                </> 
              : <>  { 
                period.hours().map((value, index) => {
                  return <option key={index} value={value}>{value / HOUR}</option> })}
                </>
      }
      </select>
      </div>

      <div className="statistics-wrraper">
      <label htmlFor="Statistics">Statistics:</label>
      <select 
          name="statistics"
          onClick={({ target }) => set_statistics( target.value === 'All' ? STATISTICS.slice(0,3) : [ target.value ])}
          >
          { STATISTICS.map((value, index) => <option key={index} value={value}>{value}</option>)}
      </select>
      </div>

      <div className="ip-address-wrraper">
      <label htmlFor="ip-address">IP Address:</label>
      <input 
          name="ip-address"
          type="text"
          placeholder="172.31.74.202"
          onChange={({ target }) => set_ip_address(target.value) } />
      </div>

      <button type="submit">Load</button>
      </form>
      <div className="chart-wrraper">
      <Chart type='line' data={char_data} />
      </div>
    </div>
  }
  </>
  );
}
