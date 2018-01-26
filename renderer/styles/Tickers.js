const styles = {
	main: {
		position: 'relative',
		height: '89vh'
	},
	categoryHeader: {
		padding: "2px 5px",
		lineHeight: "26px",
		backgroundColor: "rgba(0, 0, 0, 0.25)",
		fontSize: "14px",
		fontHeight: "bold",
		color: "#72EAD6",
		margin: 0
	},
	"categoryContent": {
		overflowY: "scroll",
		position: 'absolute',
		left: 0,
		top: 0,
		height: '100%',
		backgroundColor: 'none'
	},
	"categoryItem": {
		padding: "2px 5px",
		cursor: 'pointer'
	},
	"symbol": {
		fontWeight: "bold"
	},
	logoExchange: {
		height: "12px",
		width: "12px"
	},
	alternateRow: (i) => { return i % 2 ? {'backgroundColor': 'rgba(0,0,0,0.4)'} : {}}
}

export default styles