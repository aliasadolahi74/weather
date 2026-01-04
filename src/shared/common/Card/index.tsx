import styles from './styles.module.scss';
import * as React from 'react';
import AirFactor from '../AirFactor';
import HourlyTemperature from '../HourlyTemperature';

const Card: React.FC = () => {
  return (
    <div className={styles.Container}>
      <div className={styles.MainInfo}>
        <h2 className={styles.Temperature}>14° C</h2>
        <div className={styles.Details}>
          <div className={styles.CityInfo}>
            <span className={styles.CityName}>Toronto</span>
            <span className={styles.AQI}>Quality</span>
          </div>
          <span className={styles.Datetime}>Mar 26 2021</span>
        </div>
      </div>
      <div className={styles.ForecastDetails}>
        <div className={styles.AirFactors}>
          <AirFactor label="Wind" value="8 km/h" />
          <AirFactor label="Humidity" value="50%" />
          <AirFactor label="Rain" value="50%" />
        </div>
        <div className={styles.HourlyForecast}>
          <HourlyTemperature temperature="15°" hour="13 PM" />
          <HourlyTemperature temperature="15°" hour="13 PM" />
          <HourlyTemperature temperature="15°" hour="13 PM" />
        </div>
      </div>
    </div>
  );
};

export default Card;
