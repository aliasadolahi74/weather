import styles from './styles.module.scss';

type AirFactorsProps = {
  label: string;
  value: string;
};

const AirFactor: React.FC<AirFactorsProps> = ({ value, label }) => {
  return (
    <div className={styles.Container}>
      <div className={styles.Value}>{value}</div>
      <div className={styles.Label}>{label}</div>
    </div>
  );
};

export default AirFactor;
