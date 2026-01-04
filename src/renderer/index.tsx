import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type {
  Contact,
  ContactFrequency,
  CreateContactInput,
} from '../shared/types';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

type FormState = {
  name: string;
  location: string;
  lastContact: string;
  contactFrequency: ContactFrequency;
  customFrequencyDays: string;
  tagsInput: string;
  notes: string;
};

const emptyForm: FormState = {
  name: '',
  location: '',
  lastContact: '',
  contactFrequency: 'monthly',
  customFrequencyDays: '',
  tagsInput: '',
  notes: '',
};

const App = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [state, setState] = useState<LoadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadContacts = async () => {
      setState('loading');
      setErrorMessage(null);

      try {
        const response = await window.electronAPI.contacts.getAll();
        if (cancelled) return;

        if (!response.success) {
          setState('error');
          setErrorMessage(response.error ?? 'Unable to load contacts.');
          return;
        }

        setContacts(response.data ?? []);
        setState('ready');
      } catch (error) {
        if (cancelled) return;
        setState('error');
        setErrorMessage((error as Error).message);
      }
    };

    loadContacts();

    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(
    () =>
      contacts.map((contact) => ({
        ...contact,
        tagsLabel: contact.tags?.join(', ') ?? 'N/A',
        locationLabel: contact.location ?? 'N/A',
        lastContactLabel: contact.lastContact ?? 'N/A',
        frequencyLabel: contact.contactFrequency ?? 'N/A',
        customFrequencyDaysLabel:
          contact.customFrequencyDays ?? 'N/A',
        notesLabel: contact.notes ?? 'N/A',
      })),
    [contacts]
  );

  const handleFieldChange = (field: keyof FormState, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const payload: CreateContactInput = {
      name: form.name.trim(),
      location: form.location.trim() || undefined,
      lastContact: form.lastContact || undefined,
      contactFrequency: form.contactFrequency,
      customFrequencyDays: form.customFrequencyDays
        ? Number(form.customFrequencyDays)
        : undefined,
      notes: form.notes.trim() || undefined,
      tags: form.tagsInput
        ? form.tagsInput
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : undefined,
    };

    try {
      const response = await window.electronAPI.contacts.create(payload);
      if (!response.success || !response.data) {
        throw new Error(response.error ?? 'Unable to create contact.');
      }

      // TODO: validate contact is correct data structure w/ zod

      // bad reed bad!
      setContacts((prev) => [...prev, response.data!]);
      setIsDrawerOpen(false);
      setForm(emptyForm);
    } catch (error) {
      setSubmitError((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '32px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header
        style={{
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ marginBottom: '8px' }}>Network Helper Dashboard</h1>
          <p style={{ margin: 0, color: '#4b5563' }}>
            Contact data stored locally in your network helper database.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsDrawerOpen(true);
            setSubmitError(null);
          }}
          style={{
            padding: '10px 16px',
            background: '#111827',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.18)',
          }}
        >
          Create contact
        </button>
      </header>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
          position: 'relative',
        }}
      >
        <section
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#ffffff',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            transition: 'width 0.3s ease',
            width: isDrawerOpen ? '66%' : '100%',
            minWidth: 0,
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f9fafb',
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: '18px' }}>Contacts</h2>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                {state === 'loading'
                  ? 'Loading records...'
                  : `${contacts.length} total`}
              </p>
            </div>
          </div>

          {state === 'error' ? (
            <div style={{ padding: '20px', color: '#b91c1c' }}>
              {errorMessage}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f3f4f6' }}>
                  <tr>
                    {[
                      'Name',
                      'Location',
                      'Last Contact',
                      'Frequency',
                      'Custom Days',
                      'Tags',
                      'Notes',
                      'Created',
                      'Updated',
                    ].map((label) => (
                      <th
                        key={label}
                        style={{
                          textAlign: 'left',
                          padding: '12px 16px',
                          fontSize: '12px',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          color: '#6b7280',
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && state !== 'loading' ? (
                    <tr>
                      <td
                        colSpan={9}
                        style={{
                          padding: '20px 16px',
                          color: '#6b7280',
                        }}
                      >
                        No contacts found. Add a contact to see it here.
                      </td>
                    </tr>
                  ) : (
                    rows.map((contact) => (
                      <tr key={contact.id}>
                        <td style={{ padding: '12px 16px' }}>{contact.name}</td>
                        <td style={{ padding: '12px 16px' }}>
                          {contact.locationLabel}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {contact.lastContactLabel}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {contact.frequencyLabel}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {contact.customFrequencyDaysLabel}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {contact.tagsLabel}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {contact.notesLabel}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {contact.createdAt}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {contact.updatedAt}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside
          style={{
            width: '32%',
            maxWidth: '420px',
            minWidth: '280px',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
            transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            opacity: isDrawerOpen ? 1 : 0,
            pointerEvents: isDrawerOpen ? 'auto' : 'none',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              background: '#f9fafb',
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>Create contact</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                Add details for a new contact.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close create contact drawer"
              style={{
                background: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              X
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ padding: '16px 20px', display: 'grid', gap: '12px' }}
          >
            <label style={{ display: 'grid', gap: '6px' }}>
              <span style={{ fontWeight: 600 }}>Name</span>
              <input
                required
                value={form.name}
                onChange={(event) =>
                  handleFieldChange('name', event.target.value)
                }
                placeholder="Ada Lovelace"
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                }}
              />
            </label>

            <label style={{ display: 'grid', gap: '6px' }}>
              <span style={{ fontWeight: 600 }}>Location</span>
              <input
                value={form.location}
                onChange={(event) =>
                  handleFieldChange('location', event.target.value)
                }
                placeholder="London, UK"
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                }}
              />
            </label>

            <label style={{ display: 'grid', gap: '6px' }}>
              <span style={{ fontWeight: 600 }}>Last contact</span>
              <input
                type="date"
                value={form.lastContact}
                onChange={(event) =>
                  handleFieldChange('lastContact', event.target.value)
                }
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                }}
              />
            </label>

            <label style={{ display: 'grid', gap: '6px' }}>
              <span style={{ fontWeight: 600 }}>Frequency</span>
              <select
                value={form.contactFrequency}
                onChange={(event) =>
                  handleFieldChange(
                    'contactFrequency',
                    event.target.value as ContactFrequency
                  )
                }
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  background: '#ffffff',
                }}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
              </select>
            </label>

            <label style={{ display: 'grid', gap: '6px' }}>
              <span style={{ fontWeight: 600 }}>Custom days</span>
              <input
                type="number"
                min={1}
                value={form.customFrequencyDays}
                onChange={(event) =>
                  handleFieldChange('customFrequencyDays', event.target.value)
                }
                placeholder="30"
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                }}
              />
            </label>

            <label style={{ display: 'grid', gap: '6px' }}>
              <span style={{ fontWeight: 600 }}>Tags</span>
              <input
                value={form.tagsInput}
                onChange={(event) =>
                  handleFieldChange('tagsInput', event.target.value)
                }
                placeholder="mentor, vip, engineering"
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                }}
              />
              <span style={{ color: '#6b7280', fontSize: '12px' }}>
                Separate tags with commas.
              </span>
            </label>

            <label style={{ display: 'grid', gap: '6px' }}>
              <span style={{ fontWeight: 600 }}>Notes</span>
              <textarea
                value={form.notes}
                onChange={(event) =>
                  handleFieldChange('notes', event.target.value)
                }
                rows={4}
                placeholder="Met at React Conf..."
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  resize: 'vertical',
                }}
              />
            </label>

            {submitError ? (
              <div style={{ color: '#b91c1c', fontSize: '14px' }}>
                {submitError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: '4px',
                padding: '12px 16px',
                background: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 700,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Saving...' : 'Create contact'}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(<App />);
