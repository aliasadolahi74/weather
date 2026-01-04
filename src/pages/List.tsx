import { Link } from 'react-router-dom';

export default function List() {
  return (
    <div>
      <h1>List</h1>
      <Link to="/create">Create New</Link>
      <div>{/* List items will go here */}</div>a
    </div>
  );
}
