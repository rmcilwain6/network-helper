import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { Contact } from '../shared/types';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

const App = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [state, setState] = useState<LoadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        tagsLabel: contact.tags?.join(', ') ?? '—',
        locationLabel: contact.location ?? '—',
        lastContactLabel: contact.lastContact ?? '—',
        frequencyLabel: contact.contactFrequency ?? '—',
        customFrequencyDaysLabel:
          contact.customFrequencyDays ?? '—',
        notesLabel: contact.notes ?? '—',
      })),
    [contacts]
  );

  return (
    <div style={{ padding: '32px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '8px' }}>Network Helper Dashboard</h1>
        <p style={{ margin: 0, color: '#4b5563' }}>
          Contact data stored locally in your network helper database.
        </p>
      </header>

      <section
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
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
    </div>
  );
};

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(<App />);
