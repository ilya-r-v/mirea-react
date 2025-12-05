import { Link } from 'react-router-dom';
import './Settings.css';

function Settings() {
  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      technologies: JSON.parse(localStorage.getItem('technologies') || '[]')
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.technologies && Array.isArray(data.technologies)) {
          localStorage.setItem('technologies', JSON.stringify(data.technologies));
          alert('Данные успешно импортированы! Страница будет перезагружена.');
          window.location.reload();
        } else {
          alert('Неверный формат файла');
        }
      } catch (error) {
        alert('Ошибка при чтении файла');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
      localStorage.removeItem('technologies');
      alert('Данные сброшены. Страница будет перезагружена.');
      window.location.reload();
    }
  };

  const appInfo = [
    { label: 'Версия', value: '1.0.0' },
    { label: 'Разработчик', value: 'Трекер технологий' },
    { label: 'Описание', value: 'Приложение для отслеживания прогресса изучения технологий' },
    { label: 'Дата сборки', value: new Date().toLocaleDateString() }
  ];

  return (
    <div className="settings-page">
      {/* Шапка с заголовком и кнопкой назад */}
      <header className="settings-header">
        <div>
          <h1>Настройки</h1>
          <p className="header-subtitle">Управление приложением и данными</p>
        </div>
        <Link to="/" className="back-button">
          ← На главную
        </Link>
      </header>

      {/* Основной контент в двух колонках */}
      <div className="settings-content">
        {/* Левая колонка - Управление данными */}
        <div className="settings-column left-column">
          <div className="settings-card">
            <h2 className="card-title">Управление данными</h2>
            
            <div className="data-management-section">
              <div className="action-card">
                <div className="action-content">
                  <h3>Экспорт данных</h3>
                  <p>Создайте резервную копию всех технологий и прогресса</p>
                </div>
                <button onClick={handleExport} className="action-button primary">
                  Экспорт
                </button>
              </div>

              <div className="action-card">
                <div className="action-content">
                  <h3>Импорт данных</h3>
                  <p>Восстановите данные из резервной копии</p>
                </div>
                <label className="action-button secondary file-upload-label">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="file-input"
                  />
                  <span className="file-upload-text">Выбрать файл</span>
                </label>
              </div>
            </div>

            <div className="danger-zone">
              <p className="danger-description">
                Эти действия необратимы. Убедитесь, что у вас есть резервная копия.
              </p>
              <button onClick={handleReset} className="danger-button">
                Сбросить все данные
              </button>
            </div>
          </div>
        </div>

        {/* Правая колонка - Информация */}
        <div className="settings-column right-column">
          <div className="settings-card">
            <h2 className="card-title">Информация о приложении</h2>
            
            <div className="info-grid">
              {appInfo.map((item, index) => (
                <div key={index} className="info-item">
                  <div className="info-label">{item.label}</div>
                  <div className="info-value">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-links">
            <h3>Навигация</h3>
            <div className="links-grid">
              <Link to="/" className="quick-link">
                <span className="link-text">Главная</span>
              </Link>
              <Link to="/statistics" className="quick-link">
                <span className="link-text">Статистика</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;