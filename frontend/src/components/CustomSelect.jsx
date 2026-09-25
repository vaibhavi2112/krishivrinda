import { useState, useRef, useEffect } from 'react';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  groups = null,
  placeholder = 'निवडा',
  theme = '#2e7d32'
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // बाहेर क्लिक केल्यावर बंद करा
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // निवडलेले label शोधा
  const allOptions = groups
    ? groups.flatMap((g) => g.items)
    : options;
  const selectedLabel =
    allOptions.find((o) => o.value === value)?.label || placeholder;

  return (
    <div ref={ref} style={s.wrap}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          ...s.trigger,
          borderColor: open ? theme : '#e0e0e0'
        }}
      >
        <span style={s.triggerText}>{selectedLabel}</span>
        <span
          style={{
            ...s.arrow,
            color: theme,
            transform: open ? 'rotate(180deg)' : 'rotate(0)'
          }}
        >
          ▼
        </span>
      </button>

      {open && (
        <div style={s.menu}>
          {groups ? (
            groups.map((group) => (
              <div key={group.label}>
                <div style={s.groupLabel}>{group.label}</div>
                {group.items.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    style={{
                      ...s.item,
                      background: opt.value === value ? `${theme}15` : '#fff',
                      color: opt.value === value ? theme : '#1a1a1a',
                      fontWeight: opt.value === value ? 700 : 500
                    }}
                    onMouseEnter={(e) => {
                      if (opt.value !== value) {
                        e.currentTarget.style.background = '#f5f5f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (opt.value !== value) {
                        e.currentTarget.style.background = '#fff';
                      }
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            ))
          ) : (
            options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  ...s.item,
                  background: opt.value === value ? `${theme}15` : '#fff',
                  color: opt.value === value ? theme : '#1a1a1a',
                  fontWeight: opt.value === value ? 700 : 500
                }}
                onMouseEnter={(e) => {
                  if (opt.value !== value) {
                    e.currentTarget.style.background = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (opt.value !== value) {
                    e.currentTarget.style.background = '#fff';
                  }
                }}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const s = {
  wrap: { position: 'relative', flex: 1, width: '100%' },

  trigger: {
    width: '100%',
    height: 48,
    padding: '0 40px 0 14px',
    borderRadius: 10,
    border: '2px solid #e0e0e0',
    background: '#fff',
    fontSize: 15,
    fontFamily: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#1a1a1a',
    textAlign: 'left',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s'
  },

  triggerText: {
    color: '#1a1a1a',
    fontWeight: 500,
    fontSize: 15,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },

  arrow: {
    fontSize: 11,
    transition: 'transform 0.2s',
    marginLeft: 8
  },

  menu: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: 10,
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    maxHeight: 320,
    overflowY: 'auto',
    zIndex: 100
  },

  groupLabel: {
    padding: '10px 14px',
    background: '#f5f5f5',
    color: '#666',
    fontSize: 12,
    fontWeight: 700,
    position: 'sticky',
    top: 0,
    borderBottom: '1px solid #eee'
  },

  item: {
    padding: '12px 14px',
    fontSize: 15,
    cursor: 'pointer',
    borderBottom: '1px solid #f9f9f9',
    transition: 'background 0.15s'
  }
};