import { FaPlus } from 'react-icons/fa';
import React from 'react';
import Modal from '../commons/Modal';
import Button from '../commons/Button';
import styles from '../../styles/pages/TeaInfo/TeaCard.module.css';
import { useLanguage } from '../../context/LanguageContext';
import strings from '../../locales';
export default function TeaCard({ tea }) {
  const { lang } = useLanguage();
  const s = strings[lang].teaCard;
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

      <div className={styles.actions}>
        <Button variant="primary" icon={null}>
          {s.makeIt}
        </Button>
        <Button variant="secondary" icon={null} onClick={() => setShowModal(true)}>
          {s.details}
        </Button>
        <Button variant="secondary" icon={<FaPlus />}>{''}</Button>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div>
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
                  <Button variant="primary" icon={null}>
                    {s.makeIt}
                  </Button>
                  <Button variant="secondary" icon={<FaPlus />}>
                    {s.addToMyTeas}
                  </Button>
                </div>
                {tea.long_description?.[lang] && (
                  <>
                    <strong style={{ display: 'block', marginBottom: '1rem', marginTop: '2.5rem' }}>
                      <span role="img" aria-label="tea" style={{ fontSize: '1.6em', verticalAlign: 'middle', marginRight: '0.5rem' }}>🍵</span>
                      {s.whatToKnow}
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
                      {s.history}
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