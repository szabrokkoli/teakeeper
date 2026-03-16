import { FaPlus } from 'react-icons/fa';
import React from 'react';
import Modal from '../commons/Modal';
import Button from '../commons/Button';
import styles from '../../styles/pages/TeaInfo/TeaCard.module.css';
import { useLanguage } from '../../context/LanguageContext';
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
            {/* Kép a modal tetején */}
            {tea.image_url && (
              <img 
                src={tea.image_url} 
                alt={tea.name[lang]} 
                className={styles.modalImage}
              />
            )}
            <div className={styles.modalFlexContainer}>
              <div className={styles.modalFlexLeft}>
                <h2 className={styles.title}>{tea.name[lang]}</h2>
                <span className={styles.category}>
                  {tea.tea_categories?.name[lang]}
                </span>
                {tags.length > 0 && (
                  <div className={`${styles.tagsContainer} ${styles.modalTagsMargin}`}>
                    {tags.map((tag) => (
                      <span key={tag.id} className={styles.badge}>
                        {tag.name[lang]}
                      </span>
                    ))}
                  </div>
                )}
                <div className={styles.modalButtonRow}>
                  <Button variant="primary">
                    {lang === 'hu' ? 'Elkészítem!' : "Let's make it!"}
                  </Button>
                  <Button variant="secondary" icon={<FaPlus />}>
                    {lang === 'hu' ? 'Teáimhoz adom' : 'To My Teas'}
                  </Button>
                </div>
                {/* long_description és history megjelenítése */}
                {tea.long_description?.[lang] && (
                  <>
                    <strong style={{ display: 'block', marginBottom: '1rem', marginTop: '2.5rem' }}>
                      <span role="img" aria-label="tea" style={{ fontSize: '1.6em', verticalAlign: 'middle', marginRight: '0.5rem' }}>🍵</span>
                      {lang === 'hu' ? 'Mit kell tudni erről a Teáról:' : 'What to know about this Tea:'}
                    </strong>
                    <div className={styles.longDescriptionCard}>
                      <p style={{ textAlign: 'justify', margin: 0 }}>{tea.long_description[lang]}</p>
                    </div>
                  </>
                )}
                {tea.history?.[lang] && (
                  <>
                    <strong style={{ display: 'block', marginTop: '2.5rem' }}>
                      <span role="img" aria-label="history" style={{ fontSize: '1.6em', verticalAlign: 'middle', marginRight: '0.5rem' }}>📖</span>
                      {lang === 'hu' ? 'A Tea története:' : 'The History of this Tea:'}
                    </strong>
                    <div className={styles.longDescriptionCard} style={{ marginTop: '1rem' }}>
                      <p style={{ textAlign: 'justify', margin: 0 }}>{tea.history[lang]}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
      </Modal>
    </div>
  );
}