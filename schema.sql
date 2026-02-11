-- ... (previous schema content) ...

-- Lead Groups
CREATE TABLE lead_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50) DEFAULT 'folder',
    created_by UUID NOT NULL REFERENCES users(id),
    is_shared BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Group Members (Leads in Groups)
CREATE TABLE lead_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES lead_groups(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    added_by UUID REFERENCES users(id),
    UNIQUE(group_id, lead_id)
);

-- Lead Group Assignments (Users assigned to Groups)
CREATE TABLE lead_group_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES lead_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Google Sheets Connections
CREATE TABLE google_sheet_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES lead_groups(id) ON DELETE CASCADE,
  sheet_url TEXT NOT NULL,
  sheet_id VARCHAR(255) NOT NULL,
  sheet_tab_name VARCHAR(255) DEFAULT 'Sheet1',
  column_mapping JSONB NOT NULL DEFAULT '{}',
  last_synced_at TIMESTAMP WITH TIME ZONE,
  last_sync_status VARCHAR(50), -- 'success', 'failed', 'in_progress'
  last_sync_count INT DEFAULT 0,
  auto_sync BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. RLS POLICIES (Additions)
ALTER TABLE lead_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_group_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_sheet_connections ENABLE ROW LEVEL SECURITY;

-- Group visibility policies
CREATE POLICY groups_admin_view ON lead_groups FOR ALL TO authenticated
USING ( (SELECT role FROM users WHERE id = auth.uid()) = 'admin' );

CREATE POLICY groups_user_view ON lead_groups FOR SELECT TO authenticated
USING ( 
    created_by = auth.uid() OR 
    id IN (SELECT group_id FROM lead_group_assignments WHERE user_id = auth.uid()) OR
    is_shared = TRUE
);

-- ... (rest of file) ...