import lumeCMS from "lume/cms/mod.ts";

const cms = lumeCMS();

// Configuration here

cms.collection({
  name: "works",
  store: "src:posts/*.json",
  fields: [
    { name: "title", type: "text" },
    {
      name: "list",
      type: "object-list",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        { name: "url", type: "url" },
        { name: "startDate", type: "date" },
        { name: "endDate", type: "date" },
        { name: "techs", type: "text" },
      ],
    },
  ],
});

export default cms;
