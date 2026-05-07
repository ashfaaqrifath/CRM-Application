const { useState, useEffect } = React;

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState(null);

  const [page, setPage] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [leadForm, setLeadForm] = useState({});
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedLead, setSelectedLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteContent, setNoteContent] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function updateAuthForm(field, value) {
    setAuthForm((current) => ({ ...current, [field]: value }));
  }

  function showPage(nextPage) {
    setPage(nextPage);
    setError(null);
  }

  function finishLogin(data) {
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setPage('dashboard');
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const data = await apiService.login(authForm.email, authForm.password);
      finishLogin(data);
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const data = await apiService.register(authForm.name, authForm.email, authForm.password);

      if (data.token) {
        finishLogin(data);
      } else {
        setAuthMode('login');
        updateAuthForm('password', '');
        setMessage(data.message || 'Registration successful. You can now log in.');
      }
    } catch (err) {
      setError('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
    setEditingLead(null);
    setLeadForm({});
    setSelectedLead(null);
    setNotes([]);
    setPage('dashboard');
  }

  async function loadDashboard() {
    setLoading(true);
    try {
      setDashboard(await apiService.fetchDashboard());
    } catch (err) {
      setError('Failed to fetch dashboard: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadLeads() {
    setLoading(true);
    try {
      const allLeads = await apiService.fetchLeads({
        status: filterStatus,
        source: filterSource
      });

      const query = searchQuery.trim().toLowerCase();
      const visibleLeads = query
        ? allLeads.filter((lead) =>
            lead.name.toLowerCase().includes(query) ||
            lead.company.toLowerCase().includes(query) ||
            lead.email.toLowerCase().includes(query)
          )
        : allLeads;

      setLeads(visibleLeads);
    } catch (err) {
      setError('Failed to fetch leads: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveLead(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingLead?.id) {
        await apiService.updateLead(editingLead.id, leadForm);
      } else {
        await apiService.createLead(leadForm);
      }

      setEditingLead(null);
      setLeadForm({});
      await loadLeads();
    } catch (err) {
      setError('Failed to save lead: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteLead(id) {
    if (!confirm('Delete this lead?')) return;

    setLoading(true);
    setError(null);
    try {
      await apiService.deleteLead(id);
      await loadLeads();
    } catch (err) {
      setError('Failed to delete lead: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function startNewLead() {
    setEditingLead({});
    setLeadForm({});
  }

  function startEditLead(lead) {
    setEditingLead(lead);
    setLeadForm(lead);
  }

  function cancelLeadForm() {
    setEditingLead(null);
    setLeadForm({});
  }

  async function loadNotes(leadId) {
    try {
      setNotes(await apiService.fetchNotes(leadId));
    } catch (err) {
      setError('Failed to fetch notes: ' + err.message);
    }
  }

  function openNotes(lead) {
    setSelectedLead(lead);
    showPage('notes');
    loadNotes(lead.id);
  }

  async function addNote(e) {
    e.preventDefault();
    if (!selectedLead || !noteContent.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await apiService.createNote(selectedLead.id, noteContent);
      setNoteContent('');
      await loadNotes(selectedLead.id);
    } catch (err) {
      setError('Failed to add note: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) return;
    if (page === 'dashboard') loadDashboard();
    if (page === 'leads') loadLeads();
  }, [user, page, filterStatus, filterSource, searchQuery]);

  if (!user) {
    return (
      <LoginPage
        mode={authMode}
        form={authForm}
        loading={loading}
        error={error}
        message={message}
        onModeChange={(mode) => {
          setAuthMode(mode);
          setError(null);
          setMessage(null);
        }}
        onFormChange={updateAuthForm}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar
        user={user}
        currentPage={page}
        onPageChange={showPage}
        onLogout={handleLogout}
      />

      {error && <ErrorNotification message={error} onClose={() => setError(null)} />}

      <main className="flex-1">
        {page === 'dashboard' && <DashboardPage data={dashboard} loading={loading} />}

        {page === 'leads' && (
          <LeadsPage
            leads={leads}
            editingLead={editingLead}
            formData={leadForm}
            filterStatus={filterStatus}
            filterSource={filterSource}
            searchQuery={searchQuery}
            loading={loading}
            onNewLead={startNewLead}
            onEditLead={startEditLead}
            onDeleteLead={deleteLead}
            onSaveLead={saveLead}
            onCancelLead={cancelLeadForm}
            onFormDataChange={setLeadForm}
            onFilterStatusChange={setFilterStatus}
            onFilterSourceChange={setFilterSource}
            onSearchChange={setSearchQuery}
            onLeadRowClick={openNotes}
          />
        )}

        {page === 'notes' && selectedLead && (
          <NotesPage
            lead={selectedLead}
            notes={notes}
            noteContent={noteContent}
            loading={loading}
            onNoteContentChange={setNoteContent}
            onAddNote={addNote}
            onBack={() => showPage('leads')}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
