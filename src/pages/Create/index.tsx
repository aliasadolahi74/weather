import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCity } from '../../utils/db';

import React from 'react';

const Create = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    city: '',
    province: '',
    lat: '',
    lon: '',
  });

  const mutation = useMutation({
    mutationFn: addCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      queryClient.invalidateQueries({ queryKey: ['weather-cities'] });
      navigate('/');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      city: formData.city,
      province: formData.province,
      lat: parseFloat(formData.lat),
      lon: parseFloat(formData.lon),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <h1>Add City</h1>
      <form
        onSubmit={handleSubmit}
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
          value={formData.city}
          onChange={handleChange}
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
          value={formData.province}
          onChange={handleChange}
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
          value={formData.lat}
          onChange={handleChange}
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
          value={formData.lon}
          onChange={handleChange}
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
            disabled={mutation.isPending}
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
            {mutation.isPending ? 'Adding...' : 'Add City'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: '#666',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Cancel
          </button>
        </div>
        {mutation.isError && (
          <p style={{ color: '#ff6b6b' }}>
            Failed to add city. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default Create;
