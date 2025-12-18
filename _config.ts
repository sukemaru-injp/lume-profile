import lume from "lume/mod.ts";
import favicon from "lume/plugins/favicon.ts";
import jsx from "lume/plugins/jsx.ts";

const site = lume({
  src: "./src",
  server: {
    open: true,
  },
});
site.add("/styles.css");

site.use(jsx());
site.use(favicon({
  input: "/_assets/profile.png",
}));

// Basic function to minify CSS
function minifyCSS(css: string) {
  return css
    .replaceAll("\n", " ")
    .replaceAll(/\s+/g, " ")
    .replaceAll(/([:;{])\s/g, "$1");
}

// Process all .css files with our minifyCSS function
site.process([".css"], (files) => {
  for (const file of files) {
    file.text = minifyCSS(file.text);
  }
});

site.ignore("README.md");
export default site;
