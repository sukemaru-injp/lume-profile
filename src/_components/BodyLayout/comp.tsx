export default function ({ children }: Lume.Data) {
  return (
    <>
      <main class="main">
        {children}
      </main>
      <footer class="footer">
        <p class="text">&copy;{new Date().getFullYear()} - sukemaru</p>
      </footer>
    </>
  );
}
