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
        <link rel="stylesheet" href="/reset.css" />
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <comp.BodyLayout>
          {children}
        </comp.BodyLayout>
      </body>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-EDV6N0DZYS"
      />
      <script src="/_assets/ga4.js" />
    </html>
  </>
);
