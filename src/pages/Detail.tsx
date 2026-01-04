import { useParams, Link } from 'react-router-dom';

export default function Detail() {
  const { id } = useParams();

  return (
    <div>
      <h1>Detail - ID: {id}</h1>
      <div>
        {/* Detail content will go here */}
      </div>
      <Link to={`/edit/${id}`}>Edit</Link>
      <Link to="/">Back to List</Link>
    </div>
  );
}
