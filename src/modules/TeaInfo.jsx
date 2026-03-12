import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../App.css';

export default function TeaInfo() {
  const [teas, setTeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchTeas() {
      setLoading(true);
      const { data } = await supabase
        .from('teas')
        .select('*')
        .order('name');
      setTeas(data || []);
      setLoading(false);
    }
    fetchTeas();
  }, []);

  const filteredTeas = teas.filter(tea =>
    tea.name.toLowerCase().includes(search.toLowerCase()) ||
    tea.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section>
      <h1 className="tea-title">Explore teas</h1>
      <input
        className="form-control"
        type="text"
        placeholder="Search teas..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 'var(--space-3)', maxWidth: 320 }}
      />
      {loading ? (
        <p className="tea-loading">Loading...</p>
      ) : (
        <section className="tea-grid">
          {filteredTeas.map(tea => (
            <article className="tea-card" key={tea.id}>
              {tea.image_url && (
                <img
                  className="tea-image"
                  src={tea.image_url}
                  alt={tea.name + ' tea'}
                />
              )}
              <header className="tea-header">
                <h2 className="tea-name">{tea.name}</h2>
                <span className="tea-origin">{tea.origin}</span>
              </header>
              <p className="tea-description">{tea.description}</p>
              <div className="toolbar">
                <button className="button button-secondary">More details</button>
                <button className="button button-primary">Preparation</button>
              </div>
            </article>
          ))}
        </section>
      )}
    </section>
  );
}
