import dayjs from "dayjs";

export const title = "sukemaru|blogs";
export const layout = "_includes/layout.tsx";

export default (
  { comp, blogs }: Lume.Data,
  _helpers: Lume.Helpers,
) => {
  const blogList = [...(blogs?.list ?? [])].sort((a: { date: string }, b: {
    date: string;
  }) => {
    return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
  });

  return (
    <div class="page-wrapper">
      <section class="basic-section">
        <comp.Title>Blogs</comp.Title>
        <div class="blogs-section">
          {blogList.map((blog: {
            title: string;
            date: string;
            url: string;
          }) => (
            <div class="blog-row" key={blog.title}>
              <p class="blog-date">
                {dayjs(blog.date).format("YYYY/MM/DD")}
              </p>
              <h4>{blog.title}</h4>
              <a href={blog.url} rel="noopener noreferrer" target="_blank">
                {blog.url}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
