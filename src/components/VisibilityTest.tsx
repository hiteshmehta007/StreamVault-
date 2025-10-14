

export function VisibilityTest() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      margin: '20px',
      border: '2px solid #333',
      minHeight: '100px'
    }}>
      <h2 style={{ color: '#333', marginBottom: '10px' }}>Visibility Test Component</h2>
      
      {/* Test muted colors */}
      <div className="bg-muted text-muted-foreground p-4 mb-4" style={{
        backgroundColor: '#f1f5f9',
        color: '#475569',
        border: '1px solid #e2e8f0',
        minHeight: '50px'
      }}>
        This should be visible with muted styling
      </div>
      
      {/* Test genre buttons container */}
      <div className="genre-buttons-container" style={{
        display: 'flex',
        gap: '8px',
        padding: '16px 4px 8px 4px',
        backgroundColor: 'rgba(0,0,0,0.05)',
        minHeight: '60px'
      }}>
        <button 
          className="motion-button genre-button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            border: '1px solid #e2e8f0',
            minHeight: '32px',
            minWidth: '80px',
            cursor: 'pointer'
          }}
        >
          Test Button 1
        </button>
        
        <button 
          className="motion-button genre-button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: '1px solid #3b82f6',
            minHeight: '32px',
            minWidth: '80px',
            cursor: 'pointer'
          }}
        >
          Test Button 2 (Active)
        </button>
        
        <button 
          className="motion-button genre-button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: '#e5e7eb',
            color: '#6b7280',
            border: '1px solid #d1d5db',
            minHeight: '32px',
            minWidth: '80px',
            cursor: 'not-allowed',
            opacity: 0.7
          }}
        >
          Test Button 3 (Disabled)
        </button>
      </div>
    </div>
  );
}