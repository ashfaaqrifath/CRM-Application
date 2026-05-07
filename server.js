require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

const hasSupabaseKeys = Boolean(
  SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY
);

if (!hasSupabaseKeys) {
  console.warn('Missing Supabase keys. Copy .env.example to .env and fill in your project values.');
}

const clientOptions = {
  auth: { persistSession: false, autoRefreshToken: false }
};

const supabaseAuth = hasSupabaseKeys
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, clientOptions)
  : null;

function createUserClient(token) {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    ...clientOptions,
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
}

function fail(res, status, message) {
  return res.status(status).json({ error: message });
}

function requireSupabase(req, res, next) {
  if (!hasSupabaseKeys) {
    return fail(res, 500, 'Supabase is not configured. Add your keys to .env first.');
  }
  next();
}

function getUserName(user) {
  return user.user_metadata?.name || user.email || 'CRM User';
}

function cleanUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: getUserName(user)
  };
}

function cleanLead(lead) {
  return {
    id: lead.id,
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone || '',
    source: lead.source,
    salesperson: lead.salesperson || '',
    status: lead.status,
    dealValue: Number(lead.deal_value || 0),
    createdDate: lead.created_date,
    updatedDate: lead.updated_date
  };
}

function cleanNote(note) {
  return {
    id: note.id,
    leadId: note.lead_id,
    content: note.content,
    createdBy: note.created_by,
    createdDate: note.created_date
  };
}

function leadForDatabase(body) {
  return {
    name: body.name,
    company: body.company,
    email: body.email,
    phone: body.phone || null,
    source: body.source,
    salesperson: body.salesperson || null,
    status: body.status || 'New',
    deal_value: Number(body.dealValue || 0)
  };
}

async function saveUserToDatabase(supabase, user) {
  if (!user) return null;

  const userRecord = cleanUser(user);
  const { error } = await supabase.from('users').upsert({
    id: userRecord.id,
    name: userRecord.name,
    email: userRecord.email
  });

  if (error) throw error;
  return userRecord;
}

async function authenticate(req, res, next) {
  if (!hasSupabaseKeys) {
    return fail(res, 500, 'Supabase is not configured. Add your keys to .env first.');
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return fail(res, 401, 'No token provided');

  const { data, error } = await supabaseAuth.auth.getUser(token);
  if (error || !data.user) return fail(res, 401, 'Invalid token');

  req.user = cleanUser(data.user);
  req.supabase = createUserClient(token);
  next();
}

app.post('/api/auth/register', requireSupabase, async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return fail(res, 400, 'Name, email, and password are required');
  }

  const { data, error } = await supabaseAuth.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });

  if (error) return fail(res, 400, error.message);

  const user = data.user ? cleanUser(data.user) : null;
  if (!data.session) {
    return res.status(201).json({
      user,
      message: 'Registration successful, but email confirmation is still enabled in Supabase.'
    });
  }

  try {
    await saveUserToDatabase(createUserClient(data.session.access_token), data.user);
  } catch (err) {
    return fail(res, 400, err.message);
  }

  res.status(201).json({
    token: data.session.access_token,
    user
  });
});

app.post('/api/auth/login', requireSupabase, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return fail(res, 400, 'Email and password are required');

  const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });
  if (error) return fail(res, 401, error.message);

  try {
    await saveUserToDatabase(createUserClient(data.session.access_token), data.user);
  } catch (err) {
    return fail(res, 400, err.message);
  }

  res.json({
    token: data.session.access_token,
    user: cleanUser(data.user)
  });
});

app.get('/api/leads', authenticate, async (req, res) => {
  const { status, source, salesperson } = req.query;
  let query = req.supabase.from('leads').select('*').order('created_date', { ascending: false });

  if (status) query = query.eq('status', status);
  if (source) query = query.eq('source', source);
  if (salesperson) query = query.eq('salesperson', salesperson);

  const { data, error } = await query;
  if (error) return fail(res, 500, error.message);

  res.json(data.map(cleanLead));
});

app.post('/api/leads', authenticate, async (req, res) => {
  const { data, error } = await req.supabase
    .from('leads')
    .insert(leadForDatabase(req.body))
    .select()
    .single();

  if (error) return fail(res, 400, error.message);
  res.status(201).json(cleanLead(data));
});

app.get('/api/leads/:id', authenticate, async (req, res) => {
  const { data, error } = await req.supabase
    .from('leads')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();

  if (error) return fail(res, 500, error.message);
  if (!data) return fail(res, 404, 'Lead not found');

  res.json(cleanLead(data));
});

app.put('/api/leads/:id', authenticate, async (req, res) => {
  const { data, error } = await req.supabase
    .from('leads')
    .update(leadForDatabase(req.body))
    .eq('id', req.params.id)
    .select()
    .maybeSingle();

  if (error) return fail(res, 400, error.message);
  if (!data) return fail(res, 404, 'Lead not found');

  res.json(cleanLead(data));
});

app.delete('/api/leads/:id', authenticate, async (req, res) => {
  const { data, error } = await req.supabase
    .from('leads')
    .delete()
    .eq('id', req.params.id)
    .select()
    .maybeSingle();

  if (error) return fail(res, 500, error.message);
  if (!data) return fail(res, 404, 'Lead not found');

  res.json(cleanLead(data));
});

app.get('/api/leads/:leadId/notes', authenticate, async (req, res) => {
  const { data, error } = await req.supabase
    .from('notes')
    .select('*')
    .eq('lead_id', req.params.leadId)
    .order('created_date', { ascending: true });

  if (error) return fail(res, 500, error.message);
  res.json(data.map(cleanNote));
});

app.post('/api/leads/:leadId/notes', authenticate, async (req, res) => {
  if (!req.body.content) return fail(res, 400, 'Note content is required');

  const { data, error } = await req.supabase
    .from('notes')
    .insert({
      lead_id: req.params.leadId,
      content: req.body.content,
      created_by: req.user.name
    })
    .select()
    .single();

  if (error) return fail(res, 400, error.message);
  res.status(201).json(cleanNote(data));
});

app.get('/api/dashboard', authenticate, async (req, res) => {
  const { data: leads, error } = await req.supabase.from('leads').select('status, deal_value');
  if (error) return fail(res, 500, error.message);

  const count = (status) => leads.filter((lead) => lead.status === status).length;
  const totalDealValue = leads.reduce((sum, lead) => sum + Number(lead.deal_value || 0), 0);
  const wonDealValue = leads
    .filter((lead) => lead.status === 'Won')
    .reduce((sum, lead) => sum + Number(lead.deal_value || 0), 0);

  res.json({
    totalLeads: leads.length,
    newLeads: count('New'),
    qualifiedLeads: count('Qualified'),
    wonLeads: count('Won'),
    lostLeads: count('Lost'),
    totalDealValue,
    wonDealValue
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
