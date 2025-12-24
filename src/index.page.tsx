import dayjs from "dayjs";

export const title = "sukemaru|aboutme";
export const layout = "_includes/layout.tsx";

const WorkView = (props: {
  key: string;
  title: string;
  description: string;
  url: string;
  startDate: string;
  endDate: string;
  techs: string;
}) => {
  const formattedStartDate = dayjs(props.startDate).format("YYYY.MM");
  const formattedEndDate = props.endDate
    ? dayjs(props.endDate).format("YYYY.MM")
    : "現在";

  return (
    <div class="work-row">
      <div class="work-head">
        <h3>{props.title}</h3>
        <p class="work-dates">{formattedStartDate} - {formattedEndDate}</p>
      </div>
      <p class="work-description">
        {props.description}
      </p>
    </div>
  );
};

const PersonalDevelopmentView = (props: {
  key: string;
  title: string;
  description: string;
  url: string;
}) => {
  return (
    <div class="personal-development-row">
      <div class="personal-development-head">
        <h3>{props.title}</h3>
        <a
          href={props.url}
          class="personal-development-link"
          rel="noopener noreferrer"
          target="_blank"
        >
          {props.url}
        </a>
      </div>
      <p class="personal-development-description">
        {props.description}
      </p>
    </div>
  );
};

export default (
  { comp, works: { list }, personalDevelopment }: Lume.Data,
  _helpers: Lume.Helpers,
) => {
  const personalDevelopmentList = personalDevelopment?.list ?? [];

  return (
    <div class="page-wrapper">
      <section class="profile">
        <div class="image-wrapper">
          <img src="/_assets/profile.png" class="img" />
        </div>
        <comp.Title>クボタリョウスケ</comp.Title>
      </section>

      <section class="basic-section">
        <comp.Title>
          個人開発
        </comp.Title>
        <div class="personal-development-section">
          {personalDevelopmentList.map((item: {
            title: string;
            description: string;
            url: string;
          }) => <PersonalDevelopmentView key={item.title} {...item} />)}
        </div>
      </section>

      <section class="basic-section">
        <comp.Title>
          Works
        </comp.Title>
        <div class="works-section">
          {list.map((work: {
            title: string;
            description: string;
            url: string;
            startDate: string;
            endDate: string;
            techs: string;
          }) => <WorkView key={work.title} {...work} />)}
        </div>
      </section>
    </div>
  );
};
