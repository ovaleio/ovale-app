const styles = 
{
  table: {
    width: "100%",
    fontFamily: 'Lato',
    fontSize: '13px',
  },
  tr: {
    padding: "5px 5px"
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
  currency: {
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  alternateRow: (i) => { return i % 2 ? {'backgroundColor': 'rgba(0,0,0,0.4)'} : {}},
  logoExchange: {
    width: '16px',
    height: '16px'
  }
}

export default styles