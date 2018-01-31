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
		margin: "0px 0px 3px 0",
   		boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
	},
	"categoryContent": {
		overflowY: "scroll",
		position: 'absolute',
		left: 0,
		top: 0,
		height: '100%',
		width: '100%'
	},
	"categoryItem": {
		padding: "2px 5px",
		cursor: 'pointer',
		margin: 0
	},
	"symbol": {
		fontWeight: "bold"
	},
	logoExchange: {
		height: "12px",
		width: "12px",
		color: '#CCC'
	},
	alternateRow: (i) => { return i % 2 ? {'backgroundColor': 'rgba(0,0,0,0.4)'} : {}}
}

export default styles