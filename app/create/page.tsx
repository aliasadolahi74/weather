import Link from 'next/link';
import { createCity } from '@/actions';

export default function Create() {
  return (
    <div>
      <h1>Add City</h1>
      <form
        action={createCity}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '400px',
        }}
      >
        <input
          type="text"
          name="city"
          placeholder="City name"
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
          }}
        />
        <input
          type="text"
          name="province"
          placeholder="Province"
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
          }}
        />
        <input
          type="number"
          name="lat"
          placeholder="Latitude"
          step="any"
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
          }}
        />
        <input
          type="number"
          name="lon"
          placeholder="Longitude"
          step="any"
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
          }}
        />
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Add City
          </button>
          <Link
            href="/"
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: '#666',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              textDecoration: 'none',
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
