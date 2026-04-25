import { useEffect, useState } from 'react';
import { professorService } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import TablePager from '../../components/TablePager';

export default function ProfessorIncoming({ user }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hint, setHint] = useState(null);
  const [selectedOfferingId, setSelectedOfferingId] = useState('all');
  const [allocating, setAllocating] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');
  const professorId = user?.externalId || user?.staffId || user?.userId;

  const loadIncomingRequests = async (cancelled) => {
    setLoading(true);
    try {
      const { data } = await professorService.getIncomingRequests(professorId);
      const list = Array.isArray(data) ? data : data?.requests ?? [];
      if (!cancelled) {
        setRows(list);
        setHint(list.length ? null : 'No incoming requests for your courses yet.');
      }
    } catch (err) {
      if (!cancelled) {
        setRows([]);
        setHint(err.response?.data?.message || 'Unable to load incoming requests from the backend.');
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    loadIncomingRequests(cancelled);
    return () => {
      cancelled = true;
    };
  }, [professorId]);

  const courseOptions = rows.reduce((acc, row) => {
    const offeringId = String(row.offering_id ?? '').trim();
    if (!offeringId) return acc;
    if (!acc.some((item) => item.value === offeringId)) {
      acc.push({
        value: offeringId,
        label: `${row.course_id}${row.course_name ? ` - ${row.course_name}` : ''}`,
      });
    }
    return acc;
  }, []);

  const filteredRows =
    selectedOfferingId === 'all'
      ? rows
      : rows.filter((r) => String(r.offering_id) === String(selectedOfferingId));

  const runAllocation = async () => {
    if (selectedOfferingId === 'all') {
      setHint('Select a specific course from the dropdown to run allocation.');
      return;
    }

    setAllocating(true);
    setHint(null);
    try {
      await professorService.runAllocation(selectedOfferingId);
      setHint('Allocation completed. Request statuses have been refreshed.');
      await loadIncomingRequests(false);
    } catch (err) {
      setHint(err.response?.data?.message || 'Unable to run allocation for this course.');
    } finally {
      setAllocating(false);
    }
  };

  const totalPages =
    pageSize === 'all' ? 1 : Math.max(1, Math.ceil(filteredRows.length / Number(pageSize || 10)));
  const safePage = Math.min(page, totalPages);
  const visibleRows =
    pageSize === 'all'
      ? filteredRows
      : filteredRows.slice((safePage - 1) * Number(pageSize), (safePage - 1) * Number(pageSize) + Number(pageSize));

  if (loading) {
    return <p className="panel-muted">Loading requests...</p>;
  }

  return (
    <div className="content-panel">
      <h1 className="content-title">Incoming Requests</h1>
      <p className="content-lead">
        Students who requested your courses. Optional Pingala-style review before allocation.
      </p>
      {hint && <p className="panel-hint">{hint}</p>}
      <div className="stack-form" style={{ marginBottom: '1rem' }}>
        <label className="form-label">
          Filter by course
          <select
            className="form-input"
            value={selectedOfferingId}
            onChange={(e) => {
              setSelectedOfferingId(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All courses</option>
            {courseOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="btn-primary"
          onClick={runAllocation}
          disabled={allocating || selectedOfferingId === 'all'}
        >
          {allocating ? 'Running Allocation...' : 'Run Allocation'}
        </button>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Roll</th>
              <th>Name</th>
              <th>Course</th>
              <th>CPI</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((r) => (
              <tr key={`${r.student_id}-${r.course_id}`}>
                <td>{r.roll_no || r.student_id}</td>
                <td>{r.name}</td>
                <td>
                  <strong>{r.course_id}</strong>
                </td>
                <td>{r.cpi ?? 'N/A'}</td>
                <td>
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePager
        total={filteredRows.length}
        page={safePage}
        pageSize={pageSize}
        onPageChange={(next) => setPage(Math.min(Math.max(next, 1), totalPages))}
        onPageSizeChange={(next) => {
          setPageSize(next);
          setPage(1);
        }}
      />
    </div>
  );
}
