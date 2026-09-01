import { TEACHERS, TEACHERS_DAY_TRIBUTE } from '../data/teachersDayData';
import SectionTitle from '../components/SectionTitle';

function TeacherPhoto({ teacher }) {
  if (teacher.photo) {
    return (
      <img
        src={`/${teacher.photo.replace(/^\//, '')}`}
        alt={teacher.name}
        className="td-card-photo"
        loading="lazy"
      />
    );
  }

  return (
    <div className="td-card-avatar" aria-hidden="true">
      {teacher.avatar}
    </div>
  );
}

function TeacherCard({ teacher }) {
  return (
    <article className="td-card">
      <div className="td-card-image-wrap">
        <TeacherPhoto teacher={teacher} />
        <span className="td-card-badge"><i className="fas fa-chalkboard-teacher" /> {teacher.classes}</span>
      </div>
      <div className="td-card-body">
        <p className="td-card-role">{teacher.role}</p>
        <h3>{teacher.name}</h3>
        <div className="td-card-subject">
          <i className="fas fa-book-open" />
          <span>{teacher.subject}</span>
        </div>
        <div className="td-card-quality">
          <strong>Best Quality</strong>
          <p>{teacher.bestQuality}</p>
        </div>
        <blockquote className="td-card-tribute">
          <i className="fas fa-quote-left" />
          {teacher.tributeLine}
        </blockquote>
        <div className="td-card-meta">
          <span><i className="fas fa-star" /> {teacher.experience}</span>
          <span><i className="fas fa-map-marker-alt" /> {teacher.branch}</span>
        </div>
      </div>
    </article>
  );
}

export default function TeachersDay() {
  return (
    <>
      <section className="td-hero">
        <div className="td-hero-bg" aria-hidden="true">
          <i className="fas fa-apple-alt" />
          <i className="fas fa-chalkboard" />
          <i className="fas fa-graduation-cap" />
          <i className="fas fa-book" />
          <i className="fas fa-pencil-alt" />
          <i className="fas fa-heart" />
        </div>
        <div className="container td-hero-content">
          <span className="td-hero-date"><i className="fas fa-calendar-heart" /> 5 September — Teacher&apos;s Day</span>
          <h1>{TEACHERS_DAY_TRIBUTE.title}</h1>
          <p className="td-hero-sub">{TEACHERS_DAY_TRIBUTE.subtitle}</p>
          <div className="td-hero-message">
            <i className="fas fa-quote-left" />
            <p>{TEACHERS_DAY_TRIBUTE.message}</p>
          </div>
        </div>
      </section>

      <section className="section td-tribute-section">
        <div className="container">
          <SectionTitle
            title="Our Respected Teachers"
            subtitle="Har teacher ek alag inspiration — unki mehnat, dedication aur pyar ke liye shukriya"
          />
          <div className="td-grid">
            {TEACHERS.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        </div>
      </section>

      <section className="td-closing">
        <div className="container">
          <div className="td-closing-box">
            <i className="fas fa-hands-helping" />
            <h2>Thank You, Teachers!</h2>
            <p>
              A teacher affects eternity — they can never tell where their influence stops.
              Vidya Coachings family aap sabhi teachers ko Teacher&apos;s Day par dil se dhanyavaad karti hai.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
