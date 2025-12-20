export default function ({ children, comp }: Lume.Data) {
  return (
    <>
      <main class="main">
        {children}
      </main>
      <footer class="footer">
        <div class="icons">
          <div class="iconWrapper">
            <comp.GitHubIcon />
          </div>
          <div class="iconWrapper">
            <comp.FacebookIcon />
          </div>
                    <div class="iconWrapper">
            <comp.XIcon />
          </div>

        </div>
        <p class="text">&copy;{new Date().getFullYear()} - sukemaru</p>
      </footer>
    </>
  );
}
