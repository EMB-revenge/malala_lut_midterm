import { useState, type FormEvent } from 'react';
import { useServices } from '../context/ServiceContext';
import { createService } from '../api/serviceRoutes';
import { handleError } from '../utils/handleError';
import type { Environment } from '../types';

export default function ServiceForm() {
  const { dispatch } = useServices();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [environment, setEnvironment] = useState<Environment>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const created = await createService({ title, description, environment, status: 'open' });
      dispatch({ type: 'CREATE_SERVICE_SUCCESS', payload: created }); // server returned the new row (with its id)
      setTitle('');
      setDescription('');
      setEnvironment('');
    } catch (err) {
      handleError(err, dispatch);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Submit a ticket</h3>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (min 3 characters)"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the issue (min 5 characters)"
        rows={3}
        required
      />
      <div className="row">
        <select value={environment} onChange={(e) => setEnvironment(e.target.value as Environment)}>
          <option value="development">Low</option>
          <option value="staging">Medium</option>
          <option value="production">High</option>        </select>
        <button type="submit">Create incident</button>
      </div>
    </form>
  );
}
