const styles = {
  table: {
    width: "100%",
    fontFamily: 'Lato',
    fontSize: '13px',
  },
  tr: {
    padding: "5px 5px",
    cursor: "pointer"
  },
  tHead: {
    backgroundColor: "rgba(0,0,0,0.15)"
  },
  categoryHeader: {
    padding: "2px 5px",
    lineHeight: "26px",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    fontSize: "14px",
    fontHeight: "bold",
    color: "#72EAD6"
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
  alternateRow: (i) => { return i % 2 ? {'backgroundColor': 'rgba(0,0,0,0.4)'} : {}}
};

export default styles;