const mockPackages = [
  { id: "1", name: "resource-pack-v1.zip", size: "12.4 MB", status: "mock" },
  { id: "2", name: "modpack-snapshot.zip", size: "48.1 MB", status: "mock" },
];

export default function App() {
  return (
    <div className="layout">
      <header className="header">
        <h1>JamPlay Minecraft Admin</h1>
        <p>Панель управления пакетами для распространения через API</p>
      </header>

      <div className="grid">
        <section className="card">
          <h2>Загрузка архива</h2>
          <div className="upload-zone" aria-disabled="true">
            <strong>Перетащите .zip сюда</strong>
            <span>или нажмите для выбора файла</span>
          </div>
          <p className="hint">Функция загрузки будет доступна после подключения API</p>
        </section>

        <section className="card">
          <h2>Пакеты</h2>
          <ul className="package-list">
            {mockPackages.map((pkg) => (
              <li key={pkg.id} className="package-item">
                <div>
                  <div className="package-name">{pkg.name}</div>
                  <div className="package-meta">{pkg.size}</div>
                </div>
                <span className="status mock">пример</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card full-width">
          <div className="notice">
            API загрузки будет подключено позже. Сейчас это UI-заглушка для проверки
            деплоя поддомена minecraft.jamplay.ru.
          </div>
        </section>
      </div>
    </div>
  );
}
