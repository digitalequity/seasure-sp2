export default function DashboardMockup() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>Marine Service Pro</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <button style={{ padding: '0.5rem', color: '#6b7280' }}>
                <svg style={{ height: '1.5rem', width: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span style={{ position: 'absolute', top: 0, right: 0, height: '0.5rem', width: '0.5rem', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ height: '2rem', width: '2rem', borderRadius: '50%', backgroundColor: '#d1d5db' }}></div>
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>John Smith</span>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', height: 'calc(100vh - 4rem)' }}>
        {/* Sidebar */}
        <nav style={{ width: '16rem', backgroundColor: '#1f2937', color: 'white' }}>
          <div style={{ padding: '1rem' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#374151', textDecoration: 'none', color: 'white' }}>
                  <svg style={{ height: '1.25rem', width: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', textDecoration: 'none', color: 'white' }}>
                  <svg style={{ height: '1.25rem', width: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  <span>Boats</span>
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', textDecoration: 'none', color: 'white' }}>
                  <svg style={{ height: '1.25rem', width: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>Service Requests</span>
                </a>
              </li>
              <li>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', textDecoration: 'none', color: 'white', position: 'relative' }}>
                  <svg style={{ height: '1.25rem', width: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Messages</span>
                  <span style={{ marginLeft: 'auto', backgroundColor: '#2563eb', color: 'white', fontSize: '0.75rem', borderRadius: '9999px', padding: '0.125rem 0.5rem' }}>3</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f3f4f6' }}>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>Dashboard</h2>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Revenue Card */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginRight: '1rem' }}>
                    <svg style={{ height: '1.5rem', width: '1.5rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.25rem' }}>Monthly Revenue</p>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>$124,500</p>
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#10b981' }}>↑ 12%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boats Card */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginRight: '1rem' }}>
                    <svg style={{ height: '1.5rem', width: '1.5rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.25rem' }}>Total Boats</p>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>48</p>
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requests Card */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginRight: '1rem' }}>
                    <svg style={{ height: '1.5rem', width: '1.5rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.25rem' }}>Active Requests</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>12</p>
                      <span style={{ marginLeft: '0.5rem', padding: '0.125rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#d97706', borderRadius: '9999px' }}>3 urgent</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customers Card */}
              <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginRight: '1rem' }}>
                    <svg style={{ height: '1.5rem', width: '1.5rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.25rem' }}>Customers</p>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>156</p>
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>Quick Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <button style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: '#2563eb', borderRadius: '0.5rem' }}>
                    <svg style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>Add New Boat</span>
                </button>

                <button style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: '#10b981', borderRadius: '0.5rem' }}>
                    <svg style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>Create Request</span>
                </button>

                <button style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: '#8b5cf6', borderRadius: '0.5rem' }}>
                    <svg style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>Start Chat</span>
                </button>

                <button style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: '#f59e0b', borderRadius: '0.5rem' }}>
                    <svg style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>Schedule Service</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}