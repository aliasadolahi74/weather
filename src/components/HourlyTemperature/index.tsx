import styles from './styles.module.scss';

type HourlyTemperatureProps = {
  hour: string;
  temperature: string;
};

export default function HourlyTemperature({
  temperature,
  hour,
}: HourlyTemperatureProps) {
  return (
    <div className={styles.Container}>
      <div className={styles.Hour}>{hour}</div>
      <div className={styles.Temperature}>{temperature}</div>
    </div>
  );
}
