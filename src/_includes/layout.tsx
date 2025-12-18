export default (
  { title, children, comp }: Lume.Data,
  _helpers: Lume.Helpers,
) => (
  <>
    {{ __html: "<!DOCTYPE html>" }}
    <html>
      <head>
        <title>{title}</title>
        <meta name="description" content="sukemaru.net | By sukemaru" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <comp.BodyLayout>
          {children}
        </comp.BodyLayout>
      </body>
    </html>
  </>
);
