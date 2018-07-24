const styles = {
  main: {
    backgroundColor: "#123932",
    width: "100vw",
    height: "100vh",
    color: "#CCC",
    fontFamily: "Helvetica, sans-serif",
    fontSize: "12px",
    display: "flex",
    flexDirection: "row",
    overflow: "hidden"
  },
  leftColumn: {
    padding: 0,
    borderRight: "1px solid rgba(0,0,0,0.7)"
  },
  userDataContainer: {
    borderTop: "1px solid rgba(0,0,0,0.7)",
    height: "50vh",
  },
  tickerContainer: {
    height: "50vh",
    minHeight: "300px"
  },
  tickerCol: { /* ok in ticker container */
    width: "280px",
    display: "flex",
    flexDirection: "column"
  }
}

export default styles;