export const title = "sukemaru|aboutme";
export const layout = "_includes/layout.tsx";

export default ({ comp }: Lume.Data, _helpers: Lume.Helpers) => (
  <div class="page-wrapper">
    <div>
      <div class="profile">
        <div class="image-wrapper">
          <img src="/_assets/profile.png" class="img" />
        </div>
        <comp.Title>クボタリョウスケ</comp.Title>
      </div>
    </div>
  </div>
);
