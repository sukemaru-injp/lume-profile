import lumeCMS from "lume/cms/mod.ts";

const cms = lumeCMS();

// Configuration here

cms.document("Homepage", "src:index.page.tsx", [
  "title: text",
]);

export default cms;
