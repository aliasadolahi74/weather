import { useParams, useNavigate } from 'react-router-dom';

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle update logic
    navigate(`/detail/${id}`);
  };

  const handleDelete = () => {
    // Handle delete logic
    navigate('/');
  };

  return (
    <div>
      <h1>Edit - ID: {id}</h1>
      <form onSubmit={handleSubmit}>
        {/* Form fields will go here */}
        <button type="submit">Update</button>
        <button type="button" onClick={handleDelete}>Delete</button>
        <button type="button" onClick={() => navigate(`/detail/${id}`)}>Cancel</button>
      </form>
    </div>
  );
}
