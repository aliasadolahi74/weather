import styles from './styles.module.scss';

type HourlyTemperatureProps = {
  hour: string;
  temperature: string;
};

const HourlyTemperature: React.FC<HourlyTemperatureProps> = ({
  temperature,
  hour,
}) => {
  return (
    <div className={styles.Container}>
      <div className={styles.Hour}>{hour}</div>
      <div className={styles.Temperature}>{temperature}</div>
    </div>
  );
};

export default HourlyTemperature;
