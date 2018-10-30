const styles = {
  table: {
    width: "100%",
    fontFamily: 'Lato',
    fontSize: '13px',
    borderTop: '3px solid transparent'
  },
  tr: {
    border: '2px solid rgba(255,255,255,0)'
  },
  tHead: {
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  categoryHeader: {
    padding: "2px 5px",
    lineHeight: "26px",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    color: "#72EAD6",
    margin: 0,
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
  },
  categoryHeaderTab: {
    cursor: 'pointer'
  },
  categoryHeaderTabInactive: {
    cursor: 'pointer',
    color: '#FFF'
  },
  cancelButton: {
    cursor: "pointer",
    width: "100%",
    height: "100%",
    backgroundColor: "#ce3a00",
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
    fontSize: "11px",
    border: "none",
    color: "white",
    opacity: 0.80,
    borderRadius: 0
  },
  logoExchange: {
    width: '16px',
    height: '16px',
  },
  sellType: {
    borderRadius: '50%',
    width: '12px',
    height: '12px',
    backgroundColor: '#ce3a00',
    padding: 0
  },
  buyType: {
    borderRadius: '50%',
    width: '12px',
    height: '12px',
    backgroundColor: '#14ae35',
    padding: 0
  },
  refresh: {
    color: 'rgba(255,255,255,0.9)',
    width: '20px',
    height: '20px'
  },
  symbol: {
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default styles;