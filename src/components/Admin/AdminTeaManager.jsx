


import React, { useEffect, useState } from 'react';
import { MdDelete, MdCheck, MdClose, MdEdit } from 'react-icons/md';
import { supabase } from '../../services/supabaseClient';
import { teaService } from '../../services/teaService.js';
import styles from '../../styles/pages/AdminDashboard/AdminDashboard.module.css';
import InputGroup from '../commons/InputGroup';

function AdminTeaManager({ categories, tags }) {
  const [teas, setTeas] = useState([]);
  const [openTeaId, setOpenTeaId] = useState(null);
  const [teaEditId, setTeaEditId] = useState(null);
  const initialTeaEditValues = {
    nameHu: '',
    nameEn: '',
    category: '',
    originHu: '',
    originEn: '',
    descriptionHu: '',
    descriptionEn: '',
    image_url: '',
    longDescHu: '',
    longDescEn: '',
    historyHu: '',
    historyEn: '',
    tags: []
  };
  const [teaEditValues, setTeaEditValues] = useState({ ...initialTeaEditValues });
  const [showTeaModal, setShowTeaModal] = useState(false); // not used for inline edit
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeas();
    // eslint-disable-next-line
  }, []);

  async function fetchTeas() {
    const teasRaw = await teaService.getAllTeas();
    const teas = teasRaw.map(tea => ({
      ...tea,
      name: tea.name || {},
      origin: tea.origin || {},
      description: tea.description || {},
      long_description: tea.long_description || {},
      history: tea.history || {},
      tags: tea.tea_tags ? tea.tea_tags.map(tt => tt.tag) : []
    }));
    setTeas(teas);
  }

  function handleTeaEdit(tea) {
    setTeaEditId(tea.id);
    setOpenTeaId(tea.id);
    setTeaEditValues({
      nameHu: tea.name?.hu || '',
      nameEn: tea.name?.en || '',
      category: tea.category_id || '',
      originHu: tea.origin?.hu || '',
      originEn: tea.origin?.en || '',
      descriptionHu: tea.description?.hu || '',
      descriptionEn: tea.description?.en || '',
      image_url: tea.image_url || '',
      longDescHu: tea.long_description?.hu || '',
      longDescEn: tea.long_description?.en || '',
      historyHu: tea.history?.hu || '',
      historyEn: tea.history?.en || '',
      tags: tea.tags?.map(t => String(t.id)) || []
    });
    // setShowTeaModal(true); // not needed for inline
  }

  function handleTeaEditChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const tagId = String(value);
      setTeaEditValues(prev => {
        let currentTags = prev.tags;
        if (currentTags === undefined) {
          const activeTeaId = teaEditId || openTeaId;
          const activeTea = teas.find(t => t.id === activeTeaId);
          currentTags = activeTea ? activeTea.tags.map(t => String(t.id)) : [];
        }
        const tagList = currentTags.map(String);
        let newTags;
        if (checked) {
          newTags = [...tagList, tagId].filter((v, i, arr) => arr.indexOf(v) === i);
        } else {
          newTags = tagList.filter(t => t !== tagId);
        }
        return {
          ...prev,
          tags: newTags
        };
      });
    } else {
      setTeaEditValues(prev => ({ ...prev, [name]: value }));
    }
  }

  async function handleTeaEditSave() {
    setLoading(true);
    const updateObj = {
      name: { hu: teaEditValues.nameHu, en: teaEditValues.nameEn },
      category_id: teaEditValues.category,
      origin: { hu: teaEditValues.originHu, en: teaEditValues.originEn },
      description: { hu: teaEditValues.descriptionHu, en: teaEditValues.descriptionEn },
      image_url: teaEditValues.image_url,
      long_description: { hu: teaEditValues.longDescHu, en: teaEditValues.longDescEn },
      history: { hu: teaEditValues.historyHu, en: teaEditValues.historyEn }
    };
    await supabase.from('teas').update(updateObj).eq('id', teaEditId || openTeaId);
    setLoading(false);
    setTeaEditId(null);
    setOpenTeaId(null);
    setTeaEditValues({ ...initialTeaEditValues });
    setShowTeaModal(false);
    fetchTeas();
  }

  function handleTeaEditCancel() {
    setTeaEditId(null);
    setOpenTeaId(null);
    setTeaEditValues({ ...initialTeaEditValues });
    setShowTeaModal(false);
  }

  return (
    <section>
      <div className={styles.adminTableWrapper}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Név (HU)</th>
              <th>Név (EN)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teas.map(tea => {
              const isOpen = openTeaId === tea.id;
              return (
                <React.Fragment key={tea.id}>
                  <tr
                    className={isOpen ? styles.openRow : ''}
                    onClick={e => {
                      // Only close if already open and not clicking the edit button
                      if (isOpen) {
                        setOpenTeaId(null);
                        setTeaEditId(null);
                        setTeaEditValues({ ...initialTeaEditValues });
                      }
                    }}
                    style={{ cursor: isOpen ? 'pointer' : 'default' }}
                  >
                    <td>{tea.name?.hu}</td>
                    <td>{tea.name?.en}</td>
                    <td>
                      <button
                        className={styles.editButton}
                        title="Szerkesztés"
                        onClick={e => {
                          e.stopPropagation();
                          handleTeaEdit(tea);
                        }}
                      >
                        <MdEdit />
                      </button>
                      <button
                        className={styles.deleteButton}
                        title="Törlés"
                        onClick={e => e.stopPropagation()}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className={styles.detailRow}>
                      <td colSpan={3}>
                        <div className={styles.teaEditFields}>
                          <div className={styles.editRowGroup}>
                            <InputGroup label="Név (HU)" value={teaEditValues.nameHu !== undefined ? teaEditValues.nameHu : tea.name?.hu || ''} onChange={handleTeaEditChange} inputProps={{ name: 'nameHu' }} />
                            <InputGroup label="Név (EN)" value={teaEditValues.nameEn !== undefined ? teaEditValues.nameEn : tea.name?.en || ''} onChange={handleTeaEditChange} inputProps={{ name: 'nameEn' }} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                            <label className={`${styles.label} editCategoryLabel`} htmlFor="category">Kategória</label>
                            <select id="category" name="category" value={teaEditValues.category !== undefined ? teaEditValues.category : tea.category_id || ''} onChange={handleTeaEditChange} className={`${styles.adminInput} editCategorySelect`}>
                              <option value="">Válassz kategóriát...</option>
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name?.hu || cat.name?.en}</option>
                              ))}
                            </select>
                          </div>
                          <div className={styles.editRowGroup}>
                            <InputGroup label="Származás (HU)" value={teaEditValues.originHu !== undefined ? teaEditValues.originHu : tea.origin?.hu || ''} onChange={handleTeaEditChange} inputProps={{ name: 'originHu' }} />
                            <InputGroup label="Származás (EN)" value={teaEditValues.originEn !== undefined ? teaEditValues.originEn : tea.origin?.en || ''} onChange={handleTeaEditChange} inputProps={{ name: 'originEn' }} />
                          </div>
                          <div className={styles.editRowGroup}>
                            <InputGroup label="Leírás (HU)" value={teaEditValues.descriptionHu !== undefined ? teaEditValues.descriptionHu : tea.description?.hu || ''} onChange={handleTeaEditChange} inputProps={{ name: 'descriptionHu' }} />
                            <InputGroup label="Leírás (EN)" value={teaEditValues.descriptionEn !== undefined ? teaEditValues.descriptionEn : tea.description?.en || ''} onChange={handleTeaEditChange} inputProps={{ name: 'descriptionEn' }} />
                          </div>
                          <InputGroup label="Kép URL" value={teaEditValues.image_url !== undefined ? teaEditValues.image_url : tea.image_url || ''} onChange={handleTeaEditChange} inputProps={{ name: 'image_url' }} />
                          <div className={styles.editRowGroup}>
                            <InputGroup label="Hosszú leírás (HU)" value={teaEditValues.longDescHu !== undefined ? teaEditValues.longDescHu : tea.long_description?.hu || ''} onChange={handleTeaEditChange} inputProps={{ name: 'longDescHu' }} />
                            <InputGroup label="Hosszú leírás (EN)" value={teaEditValues.longDescEn !== undefined ? teaEditValues.longDescEn : tea.long_description?.en || ''} onChange={handleTeaEditChange} inputProps={{ name: 'longDescEn' }} />
                          </div>
                          <div className={styles.editRowGroup}>
                            <InputGroup label="Történet (HU)" value={teaEditValues.historyHu !== undefined ? teaEditValues.historyHu : tea.history?.hu || ''} onChange={handleTeaEditChange} inputProps={{ name: 'historyHu' }} />
                            <InputGroup label="Történet (EN)" value={teaEditValues.historyEn !== undefined ? teaEditValues.historyEn : tea.history?.en || ''} onChange={handleTeaEditChange} inputProps={{ name: 'historyEn' }} />
                          </div>
                          <div className={styles.tagCheckboxList}>
                            <span>Tagek:</span>
                            {tags.map(tag => (
                              <label key={tag.id} className={styles.tagCheckboxLabel}>
                                <input
                                  type="checkbox"
                                  name="tags"
                                  value={String(tag.id)}
                                  checked={
                                    teaEditValues.tags !== undefined
                                      ? teaEditValues.tags.map(String).includes(String(tag.id))
                                      : (tea.tags || []).map(t => String(t.id)).includes(String(tag.id))
                                  }
                                  onChange={handleTeaEditChange}
                                />
                                {tag.name?.hu || tag.name?.en}
                              </label>
                            ))}
                          </div>
                          <div className={styles.modalActions}>
                            <button className={styles.saveButton} onClick={handleTeaEditSave} disabled={loading}><MdCheck /> Mentés</button>
                            <button className={styles.cancelButton} onClick={handleTeaEditCancel} disabled={loading}><MdClose /> Mégse</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {showTeaModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Tea szerkesztése</h2>
            <InputGroup label="Név (HU)" value={teaEditValues.nameHu} onChange={handleTeaEditChange} inputProps={{ name: 'nameHu' }} />
            <InputGroup label="Név (EN)" value={teaEditValues.nameEn} onChange={handleTeaEditChange} inputProps={{ name: 'nameEn' }} />
            <select name="category" value={teaEditValues.category} onChange={handleTeaEditChange} className={styles.adminInput}>
              <option value="">Válassz kategóriát...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name?.hu || cat.name?.en}</option>
              ))}
            </select>
            <InputGroup label="Származás (HU)" value={teaEditValues.originHu} onChange={handleTeaEditChange} inputProps={{ name: 'originHu' }} />
            <InputGroup label="Származás (EN)" value={teaEditValues.originEn} onChange={handleTeaEditChange} inputProps={{ name: 'originEn' }} />
            <InputGroup label="Leírás (HU)" value={teaEditValues.descriptionHu} onChange={handleTeaEditChange} inputProps={{ name: 'descriptionHu' }} />
            <InputGroup label="Leírás (EN)" value={teaEditValues.descriptionEn} onChange={handleTeaEditChange} inputProps={{ name: 'descriptionEn' }} />
            <InputGroup label="Kép URL" value={teaEditValues.image_url} onChange={handleTeaEditChange} inputProps={{ name: 'image_url' }} />
            <InputGroup label="Hosszú leírás (HU)" value={teaEditValues.longDescHu} onChange={handleTeaEditChange} inputProps={{ name: 'longDescHu' }} />
            <InputGroup label="Hosszú leírás (EN)" value={teaEditValues.longDescEn} onChange={handleTeaEditChange} inputProps={{ name: 'longDescEn' }} />
            <InputGroup label="Történet (HU)" value={teaEditValues.historyHu} onChange={handleTeaEditChange} inputProps={{ name: 'historyHu' }} />
            <InputGroup label="Történet (EN)" value={teaEditValues.historyEn} onChange={handleTeaEditChange} inputProps={{ name: 'historyEn' }} />
            <div className={styles.tagCheckboxList}>
              <span>Tagek:</span>
              {tags.map(tag => (
                <label key={tag.id} className={styles.tagCheckboxLabel}>
                  <input
                    type="checkbox"
                    name="tags"
                    value={String(tag.id)}
                    checked={teaEditValues.tags?.map(String).includes(String(tag.id))}
                    onChange={handleTeaEditChange}
                  />
                  {tag.name?.hu || tag.name?.en}
                </label>
              ))}
            </div>
            <div className={styles.modalActions}>
              <button className={styles.saveButton} onClick={handleTeaEditSave} disabled={loading}><MdCheck /> Mentés</button>
              <button className={styles.cancelButton} onClick={handleTeaEditCancel} disabled={loading}><MdClose /> Mégse</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminTeaManager;

