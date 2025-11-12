export const CREATE_CONTACTS_TABLE = `
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    last_contact TEXT,
    contact_frequency TEXT,
    notes TEXT,
    tags TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`;

export const CREATE_INDEXES = [
  'CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(name)',
  'CREATE INDEX IF NOT EXISTS idx_contacts_location ON contacts(location)',
  'CREATE INDEX IF NOT EXISTS idx_contacts_last_contact ON contacts(last_contact)',
  'CREATE INDEX IF NOT EXISTS idx_contacts_contact_frequency ON contacts(contact_frequency)',
];
