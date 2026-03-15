import { FaPlus } from 'react-icons/fa';
import React from 'react';
import Modal from './Modal';
import Button from './Button';
import styles from '../styles/TeaCard.module.css';
import { useLanguage } from '../context/LanguageContext';
export default function TeaCard({ tea }) {
  const { lang } = useLanguage();
  const [showModal, setShowModal] = React.useState(false);
  const tags = tea.tea_tags?.map(relation => relation.tag) || [];
  return (
    <div className={styles.card}>
      {tea.image_url && (
        <img 
          src={tea.image_url} 
          alt={tea.name[lang]} 
          className={styles.image} 
        />
      )}

      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.category}>
            {tea.tea_categories?.name[lang]}
          </span>
          <h3 className={styles.title}>{tea.name[lang]}</h3>
        </div>

        {/* Címkék (Tags) megjelenítése */}
        {tags.length > 0 && (
            <div className={styles.tagsContainer}>
              {tags.map((tag) => (
                <span key={tag.id} className={`${styles.badge} ${styles.smallBadge}`}>
                  {tag.name[lang]}
                </span>
              ))}
            </div>
        )}

        <p className={styles.description}>
          {tea.description?.[lang]}
        </p>

      </div>

      {/* Gombok */}
      <div className={styles.actions}>
        <Button variant="primary">
          {lang === 'hu' ? 'Elkészítem!' : "Let's make it!"}
        </Button>
        <Button variant="secondary" onClick={() => setShowModal(true)}>
          {lang === 'hu' ? 'Részletek' : 'Details'}
        </Button>
        <Button variant="secondary" icon={<FaPlus />} />
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div>
            {/* Felső konténer: név, kategória, tagek, kép */}
            <div className={styles.modalFlexContainer}>
              <div className={styles.modalFlexLeft}>
                <h2 className={styles.title}>{tea.name[lang]}</h2>
                <span className={styles.category}>
                  {tea.tea_categories?.name[lang]}
                </span>
                {tags.length > 0 && (
                  <div className={styles.tagsContainer} style={{ marginTop: '1rem' }}>
                    {tags.map((tag) => (
                      <span key={tag.id} className={styles.badge}>
                        {tag.name[lang]}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <Button variant="primary">
                    {lang === 'hu' ? 'Elkészítem!' : "Let's make it!"}
                  </Button>
                  <Button variant="secondary" icon={<FaPlus />}>
                    {lang === 'hu' ? 'Teáimhoz adom' : 'Add to My Teas'}
                  </Button>
                </div>
              </div>
              {tea.image_url && (
                <img 
                  src={tea.image_url} 
                  alt={tea.name[lang]} 
                  className={styles.modalImage}
                />
              )}
            </div>
            {/* Alatta a többi tartalom szabadon */}
            {tea.long_description?.[lang] && (
              <div className={styles.modalSection}>
                <h4 className={styles.modalSectionTitle}>
                  {lang === 'hu' ? 'Mit kell tudni erről a teáról' : 'What to know about this Tea'}
                </h4>
                  <p className={styles.modalJustify}>{tea.long_description[lang]}</p>
                </div>
            )}
            {tea.history?.[lang] && (
              <div className={styles.modalSection}>
                <h4 className={styles.modalSectionTitle}>
                  {lang === 'hu' 
                    ? `A ${tea.name[lang]} történelméről` 
                    : `On the history of ${tea.name[lang]}`}
                </h4>
                  <p className={styles.modalJustify}>{tea.history[lang]}</p>
                </div>
            )}
          </div>
      </Modal>
    </div>
  );
}
