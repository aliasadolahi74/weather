import styles from './styles.module.scss';

type AirFactorsProps = {
  label: string;
  value: string;
};

export default function AirFactor({ value, label }: AirFactorsProps) {
  return (
    <div className={styles.Container}>
      <div className={styles.Value}>{value}</div>
      <div className={styles.Label}>{label}</div>
    </div>
  );
}
