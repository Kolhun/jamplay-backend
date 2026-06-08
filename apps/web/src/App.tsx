const buildTime = import.meta.env.VITE_BUILD_TIME || "dev";
const gitBranch = import.meta.env.VITE_GIT_BRANCH || "local";

export default function App() {
  return (
    <main className="page">
      <span className="badge">debug</span>
      <h1>JamPlay</h1>
      <p className="lead">
        Платформа JamPlay. Это временная страница для проверки деплоя и DNS.
      </p>

      <section className="card">
        <h2>Debug info</h2>
        <table className="debug-table">
          <tbody>
            <tr>
              <td>Hostname</td>
              <td>{window.location.hostname}</td>
            </tr>
            <tr>
              <td>Build time</td>
              <td>{buildTime}</td>
            </tr>
            <tr>
              <td>Git branch</td>
              <td>{gitBranch}</td>
            </tr>
            <tr>
              <td>Mode</td>
              <td>{import.meta.env.MODE}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Ссылки</h2>
        <div className="links">
          <a href="https://minecraft.jamplay.ru">minecraft.jamplay.ru</a>
        </div>
      </section>
    </main>
  );
}
