const styles = {
  main: {
    backgroundColor: "#123932",
    width: "100vw",
    height: "100vh",
    color: "#CCC",
    fontFamily: "Helvetica",
    fontSize: "12px",
    display: "flex",
    flexDirection: "row",
    overflow: "hidden"
  },
  leftColumn: {
    padding: 0,
    borderRight: "1px solid #D2E4E1"
  },
  userDataContainer: {
    borderTop: "1px solid #D2E4E1",
    height: "45vh",
    overflow: "scroll"
  },
  tickerContainer: {
    height: "55vh",
    minHeight: "300px"
  },
  tickerCol: { /* ok in ticker container */
    width: "280px",
    borderLeft: "1px solid #D2E4E1",
    display: "flex",
    flexDirection: "column"
  }
}

export default styles;