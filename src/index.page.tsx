export const title = "sukemaru|aboutme";
export const layout = "_includes/layout.tsx";

export default ({ comp }: Lume.Data, _helpers: Lume.Helpers) => (
  <div class="page-wrapper">
    <div>
      <comp.Title>About Me</comp.Title>
      <h2>Frontend Developer Sukemaru</h2>
      <a
        href="https://www.sukemaru.net"
        rel="noopener noreferrer"
        target="_blank"
      >
        my website
      </a>
    </div>
  </div>
);
