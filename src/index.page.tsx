export const title = "sukemaru|aboutme";
export const layout = "_includes/layout.tsx";

export default ({ comp, works }: Lume.Data, _helpers: Lume.Helpers) => {
  console.log(works);
  return (
    <div class="page-wrapper">
      <section class="profile">
        <div class="image-wrapper">
          <img src="/_assets/profile.png" class="img" />
        </div>
        <comp.Title>クボタリョウスケ</comp.Title>
      </section>

      <section class="basic-section">
        <comp.Title>
          Works
        </comp.Title>
        <div>
          - 色々なWebサイト制作・運用<br />
          - ブログ執筆
        </div>
      </section>

      <section class="basic-section">
        <comp.Title>
          個人開発
        </comp.Title>
        <div>
          - 色々なWebサイト制作・運用<br />
          - ブログ執筆
        </div>
      </section>
    </div>
  );
};
