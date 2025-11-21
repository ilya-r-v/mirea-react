// components/TechnologyNotes.jsx
import './TechnologyNotes.css';

const TechnologyNotes = ({ notes, onNotesChange, techId }) => {
  const handleChange = (e) => {
    onNotesChange(techId, e.target.value);
  };

  return (
    <div className="technology-notes">
      <h4 className="technology-notes__title">Мои заметки:</h4>
      <textarea
        value={notes}
        onChange={handleChange}
        placeholder="Записывайте сюда важные моменты, идеи, ссылки на ресурсы..."
        rows="3"
        className="technology-notes__textarea"
      />
      <div className={`technology-notes__hint ${notes.length > 0 ? 'technology-notes__hint--active' : ''}`}>
        {notes.length > 0 ? (
          <>📝 Заметка сохранена ({notes.length} символов)</>
        ) : (
          '💡 Добавьте заметку для этой технологии'
        )}
      </div>
    </div>
  );
};

export default TechnologyNotes;