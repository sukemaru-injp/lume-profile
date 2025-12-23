export const title = "sukemaru|blogs";
export const layout = "_includes/layout.tsx";

export default ({ comp }: Lume.Data, _helpers: Lume.Helpers) => (
  <div class="page-wrapper">
    <section class="basic-section">
      <comp.Title>Blogs</comp.Title>
    </section>
  </div>
);
