export default function ({ children, comp }: Lume.Data) {
  return (
    <>
      <header class="header">
        <h1 class="title">sukemaru.net</h1>
      </header>
      <main class="main">
        <div class="nav">
          <a href="/" class="anchor">About Me</a>
          <span>&nbsp;/&nbsp;</span>
          <a href="/blogs" class="anchor">Blogs</a>
        </div>
        {children}
      </main>
      <footer class="footer">
        <div class="icons">
          <div class="iconWrapper">
            <a
              href="https://github.com/sukemaru-injp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <comp.GitHubIcon />
            </a>
          </div>
          <div class="iconWrapper">
            <a
              href="https://www.facebook.com/profile.php?id=100029782609298"
              target="_blank"
              rel="noopener noreferrer"
            >
              <comp.FacebookIcon />
            </a>
          </div>
          <div class="iconWrapper">
            <a
              href="https://x.com/Inakamon_0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <comp.XIcon />
            </a>
          </div>
        </div>
        <p class="text">&copy; {new Date().getFullYear()} - sukemaru</p>
      </footer>
    </>
  );
}
