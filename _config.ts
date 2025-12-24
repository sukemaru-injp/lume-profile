import lume from "lume/mod.ts";
import favicon from "lume/plugins/favicon.ts";
import jsx from "lume/plugins/jsx.ts";
import icons from "lume/plugins/icons.ts";
import works from "./src/posts/works.json" with { type: "json" };
import personalDevelopment from "./src/posts/personalDevelopment.json" with {
  type: "json",
};

const site = lume({
  src: "./src",
  server: {
    open: true,
  },
});
site.add("/reset.css");

site.use(jsx());
site.use(icons());

site.use(favicon({
  input: "/_assets/profile.png",
}));

site.copy("_assets");

site.data("works", works);
site.data("personalDevelopment", personalDevelopment);

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
