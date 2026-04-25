import { useState } from 'react';
import { professorService } from '../../services/api';

const emptyForm = {
  course_code: '',
  course_name: '',
  course_credit: 9,
  max_seats: 40,
  offering_dept: '',
};

export default function ProfessorCreateCourse({ user }) {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const professorId = user?.externalId || user?.staffId || user?.userId;

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await professorService.createCourse({
        professor_id: professorId,
        course_code: form.course_code,
        course_name: form.course_name,
        course_credit: form.course_credit,
        offering_dept: form.offering_dept,
        max_seats: form.max_seats,
      });
      setMessage(`Course ${form.course_code} saved and added to My Courses.`);
      window.dispatchEvent(new Event('professor-course-saved'));
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Save failed.');
    }
  };

  return (
    <div className="content-panel">
      <h1 className="content-title">Create Course</h1>
      <p className="content-lead">
        Add a new offering. Lecture, tutorial, and lab meeting slots can be added in a follow-up API.
      </p>
      {message && <p className="panel-hint">{message}</p>}
      {error && <p className="panel-error">{error}</p>}
      <form className="stack-form" onSubmit={submit}>
        <label className="form-label">
          Course code
          <input
            className="form-input"
            required
            value={form.course_code}
            onChange={(e) => setForm({ ...form, course_code: e.target.value.toUpperCase() })}
            placeholder="e.g. CE371"
          />
        </label>
        <label className="form-label">
          Title
          <input
            className="form-input"
            required
            value={form.course_name}
            onChange={(e) => setForm({ ...form, course_name: e.target.value })}
          />
        </label>
        <div className="form-row">
          <label className="form-label">
            Credits
            <input
              className="form-input"
              type="number"
              min={1}
              max={40}
              value={form.course_credit}
              onChange={(e) => setForm({ ...form, course_credit: Number(e.target.value) })}
            />
          </label>
          <label className="form-label">
            Max seats
            <input
              className="form-input"
              type="number"
              min={1}
              value={form.max_seats}
              onChange={(e) => setForm({ ...form, max_seats: Number(e.target.value) })}
            />
          </label>
          <label className="form-label">
            Offering dept
            <input
              className="form-input"
              value={form.offering_dept}
              onChange={(e) => setForm({ ...form, offering_dept: e.target.value.toUpperCase() })}
              placeholder="CE"
            />
          </label>
        </div>
        <button type="submit" className="btn-primary">
          Save course
        </button>
      </form>
    </div>
  );
}
