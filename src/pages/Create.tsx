import { useNavigate } from 'react-router-dom';

export default function Create() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle create logic
    navigate('/');
  };

  return (
    <div>
      <h1>Create</h1>
      <form onSubmit={handleSubmit}>
        {/* Form fields will go here */}
        <button type="submit">Create</button>
        <button type="button" onClick={() => navigate('/')}>Cancel</button>
      </form>
    </div>
  );
}
