const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const SOURCE_OPTIONS = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event'];
const formatLkr = (value) => `LKR ${Number(value || 0).toLocaleString()}`;

const DASH_CARD_STYLES = {
  blue: 'border-blue-200 bg-blue-50/60 text-blue-700',
  yellow: 'border-amber-200 bg-amber-50/70 text-amber-700',
  orange: 'border-orange-200 bg-orange-50/70 text-orange-700',
  green: 'border-emerald-200 bg-emerald-50/70 text-emerald-700',
  red: 'border-rose-200 bg-rose-50/70 text-rose-700',
  purple: 'border-violet-200 bg-violet-50/70 text-violet-700'
};

function LoginPage({
  mode,
  form,
  loading,
  error,
  message,
  onModeChange,
  onFormChange,
  onLogin,
  onRegister
}) {
  const isRegistering = mode === 'register';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="bg-white rounded-lg crm-card p-8 w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold text-blue-700 mb-2">Lead Management</p>
            <h1 className="text-3xl font-bold text-slate-900">CRM Application</h1>
          </div>
          <div className="grid grid-cols-2 gap-1 mb-6 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => onModeChange('login')}
              className={`py-2 rounded-md font-semibold transition ${!isRegistering ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              disabled={loading}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => onModeChange('register')}
              className={`py-2 rounded-md font-semibold transition ${isRegistering ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              disabled={loading}
            >
              Register
            </button>
          </div>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-100 rounded-lg">{error}</div>}
          {message && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg">{message}</div>}
          <form onSubmit={isRegistering ? onRegister : onLogin} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => onFormChange('name', e.target.value)}
                  className="w-full crm-input"
                  placeholder="Your name"
                  disabled={loading}
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => onFormChange('email', e.target.value)}
                className="w-full crm-input"
                placeholder="you@example.com"
                disabled={loading}
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => onFormChange('password', e.target.value)}
                className="w-full crm-input"
                placeholder="At least 6 characters"
                disabled={loading}
                required
                minLength="6"
              />
            </div>
            <button 
              type="submit" 
              className="w-full crm-btn bg-blue-600 text-white py-2.5 hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (isRegistering ? 'Creating account...' : 'Logging in...') : (isRegistering ? 'Create Account' : 'Login')}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Navbar({ user, currentPage, onPageChange, onLogout }) {
  return (
    <nav className="bg-white/95 text-slate-900 border-b border-slate-200 sticky top-0 z-20 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-xl font-bold">CRM Application</h1>
          <p className="text-xs text-slate-500">Lead Management</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button 
            onClick={() => onPageChange('dashboard')} 
            className={`crm-btn px-4 py-2 ${currentPage === 'dashboard' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => onPageChange('leads')} 
            className={`crm-btn px-4 py-2 ${currentPage === 'leads' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            Leads
          </button>
          <button 
            onClick={onLogout} 
            className="crm-btn px-4 py-2 border border-slate-200 text-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
          >
            Logout <span className="text-slate-400">({user.name})</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="py-5 text-center text-sm text-slate-500">
      Developed by Ashfaaq Rifath
    </footer>
  );
}

function ErrorNotification({ message, onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-red-600 text-white px-5 py-3 rounded-lg shadow-lg max-w-sm z-30">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 font-bold">x</button>
      </div>
    </div>
  );
}

function DashboardPage({ data, loading }) {
  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-center text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  const dashCards = [
    { label: 'Total Leads', value: data.totalLeads, color: 'blue' },
    { label: 'New Leads', value: data.newLeads, color: 'yellow' },
    { label: 'Qualified', value: data.qualifiedLeads, color: 'orange' },
    { label: 'Won Deals', value: data.wonLeads, color: 'green' },
    { label: 'Lost Deals', value: data.lostLeads, color: 'red' },
    { label: 'Total Deal Value', value: formatLkr(data.totalDealValue), color: 'purple' },
    { label: 'Won Deal Value', value: formatLkr(data.wonDealValue), color: 'green', full: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-700">Overview</p>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashCards.map((card, idx) => (
          <div key={idx} className={`bg-white rounded-lg crm-card p-6 border-t-4 ${DASH_CARD_STYLES[card.color]} ${card.full ? 'md:col-span-2 lg:col-span-1' : ''}`}>
            <p className="text-slate-600 text-sm font-medium">{card.label}</p>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadsPage({
  leads,
  editingLead,
  formData,
  filterStatus,
  filterSource,
  searchQuery,
  loading,
  onNewLead,
  onEditLead,
  onDeleteLead,
  onSaveLead,
  onCancelLead,
  onFormDataChange,
  onFilterStatusChange,
  onFilterSourceChange,
  onSearchChange,
  onLeadRowClick
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-8">
        <div>
          <p className="text-sm font-semibold text-blue-700">Pipeline</p>
          <h2 className="text-3xl font-bold text-slate-900">Leads</h2>
        </div>
        <button
          onClick={onNewLead}
          className="crm-btn bg-blue-600 text-white px-5 py-2.5 hover:bg-blue-700"
        >
          + New Lead
        </button>
      </div>

      <div className="bg-white rounded-lg crm-card p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by name, company, email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="crm-input md:col-span-2"
        />
        <select
          value={filterStatus}
          onChange={(e) => onFilterStatusChange(e.target.value)}
          className="crm-input"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select
          value={filterSource}
          onChange={(e) => onFilterSourceChange(e.target.value)}
          className="crm-input"
        >
          <option value="">All Sources</option>
          {SOURCE_OPTIONS.map((source) => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>
      </div>

      {editingLead !== null && (
        <LeadForm
          lead={editingLead}
          formData={formData}
          onFormDataChange={onFormDataChange}
          onSave={onSaveLead}
          onCancel={onCancelLead}
          loading={loading}
        />
      )}

      <LeadsTable
        leads={leads}
        loading={loading}
        onEdit={onEditLead}
        onDelete={onDeleteLead}
        onRowClick={onLeadRowClick}
      />
    </div>
  );
}

function LeadForm({ lead, formData, onFormDataChange, onSave, onCancel, loading }) {
  return (
    <div className="bg-white rounded-lg crm-card p-6 mb-8">
      <h3 className="text-xl font-bold text-slate-900 mb-4">{lead.id ? 'Edit Lead' : 'Create New Lead'}</h3>
      <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Lead Name"
          value={formData.name || ''}
          onChange={(e) => onFormDataChange({...formData, name: e.target.value})}
          className="crm-input"
          required
          disabled={loading}
        />
        <input
          placeholder="Company Name"
          value={formData.company || ''}
          onChange={(e) => onFormDataChange({...formData, company: e.target.value})}
          className="crm-input"
          required
          disabled={loading}
        />
        <input
          placeholder="Email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => onFormDataChange({...formData, email: e.target.value})}
          className="crm-input"
          required
          disabled={loading}
        />
        <input
          placeholder="Phone Number"
          value={formData.phone || ''}
          onChange={(e) => onFormDataChange({...formData, phone: e.target.value})}
          className="crm-input"
          disabled={loading}
        />
        <select
          value={formData.source || ''}
          onChange={(e) => onFormDataChange({...formData, source: e.target.value})}
          className="crm-input"
          required
          disabled={loading}
        >
          <option value="">Select Lead Source</option>
          {SOURCE_OPTIONS.map((source) => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>
        <input
          placeholder="Assigned Salesperson"
          value={formData.salesperson || ''}
          onChange={(e) => onFormDataChange({...formData, salesperson: e.target.value})}
          className="crm-input"
          disabled={loading}
        />
        <select
          value={formData.status || 'New'}
          onChange={(e) => onFormDataChange({...formData, status: e.target.value})}
          className="crm-input"
          disabled={loading}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <input
          placeholder="Deal Value (LKR)"
          type="number"
          value={formData.dealValue || ''}
          onChange={(e) => onFormDataChange({...formData, dealValue: parseFloat(e.target.value) || 0})}
          className="crm-input"
          disabled={loading}
        />
        <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
          <button 
            type="submit" 
            className="crm-btn bg-emerald-600 text-white px-5 py-2.5 hover:bg-emerald-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : lead.id ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="crm-btn border border-slate-200 text-slate-700 px-5 py-2.5 hover:bg-slate-100"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function LeadsTable({ leads, loading, onEdit, onDelete, onRowClick }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg crm-card p-6 text-center text-slate-500">
        Loading leads...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg crm-card overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Name</th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Company</th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Email</th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Status</th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Deal Value</th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map(lead => (
            <tr key={lead.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-semibold text-slate-900">{lead.name}</td>
              <td className="px-6 py-4 text-slate-700">{lead.company}</td>
              <td className="px-6 py-4 text-slate-600">{lead.email}</td>
              <td className="px-6 py-4">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-6 py-4 font-medium text-slate-800">{formatLkr(lead.dealValue)}</td>
              <td className="px-6 py-4 flex flex-wrap gap-2">
                <button
                  onClick={() => onRowClick(lead)}
                  className="crm-btn border border-violet-200 text-violet-700 px-3 py-1.5 text-sm hover:bg-violet-50"
                >
                  Notes
                </button>
                <button
                  onClick={() => onEdit(lead)}
                  className="crm-btn border border-amber-200 text-amber-700 px-3 py-1.5 text-sm hover:bg-amber-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(lead.id)}
                  className="crm-btn border border-red-200 text-red-700 px-3 py-1.5 text-sm hover:bg-red-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {leads.length === 0 && (
        <div className="p-8 text-center text-slate-500">No leads found</div>
      )}
    </div>
  );
}


function StatusBadge({ status }) {
  const statusColors = {
    'Won': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Lost': 'bg-red-50 text-red-700 border-red-200',
    'Qualified': 'bg-blue-50 text-blue-700 border-blue-200',
    'New': 'bg-amber-50 text-amber-700 border-amber-200',
    'Contacted': 'bg-sky-50 text-sky-700 border-sky-200',
    'Proposal Sent': 'bg-orange-50 text-orange-700 border-orange-200'
  };

  const colorClass = statusColors[status] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
      {status}
    </span>
  );
}

function NotesPage({ lead, notes, noteContent, loading, onNoteContentChange, onAddNote, onBack }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button
        onClick={onBack}
        className="mb-6 text-blue-700 hover:text-blue-800 font-semibold transition"
      >
        Back to leads
      </button>
      <div className="bg-white rounded-lg crm-card p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{lead.name}</h2>
        <p className="text-slate-600 mb-6">{lead.company} - {lead.email}</p>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Add Note</h3>
          <form onSubmit={onAddNote} className="space-y-4">
            <textarea
              value={noteContent}
              onChange={(e) => onNoteContentChange(e.target.value)}
              placeholder="Write a note..."
              className="w-full crm-input"
              rows="4"
              required
              disabled={loading}
            ></textarea>
            <button 
              type="submit" 
              className="crm-btn bg-blue-600 text-white px-5 py-2.5 hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Note'}
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">Notes ({notes.length})</h3>
          <div className="space-y-4">
            {notes.map(note => (
              <div key={note.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200 border-l-4 border-l-blue-500">
                <p className="font-semibold text-sm text-slate-500">{note.createdBy} - {new Date(note.createdDate).toLocaleString()}</p>
                <p className="text-slate-800 mt-2">{note.content}</p>
              </div>
            ))}
            {notes.length === 0 && (
              <p className="text-slate-500 text-center py-8">No notes yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
