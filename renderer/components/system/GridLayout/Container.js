import React from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from '../../../selectors/common'


import { WidthProvider, Responsive } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

import Tickers from '../../core/Tickers/Tickers'
import TickerInfo from '../../core/TickerInfo/TickerInfo'
import Trades from '../../core/Trades/Trades'

import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"



import Box from './Box';

import PropTypes from 'prop-types';


 class Container extends React.PureComponent {

    constructor(props) {
        super(props);
    }
  
    componentDidMount() {
        console.log(window.innerHeight)
        this.setState({'windowWidth':window.innerWidth});
        this.setState({'windowWidth':window.innerHeight});
        // On Resize, listen to the layout
        window.onresize = () => {
            this.setState({'windowWidth':window.innerWidth, 'windowheight':window.innerheight});
            this.setState();
        }
    }
    
    
    render() {

      // layout is an array of objects, see the demo for more complete usage
      return (
        <div>
            <ResponsiveReactGridLayout
                id="layout"
                className="layout"
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={32}
                verticalCompact="false"
                handle=".draggable-handle"
                draggableCancel=".draggable-inside">
            <div key="a" data-grid={{x: 0, y: 0, w: 2, h: 16, minW: 2, maxH:16}}>
                    <div className="draggable-handle">
                        <div className="handle-title">
                            Tickers 
                        </div>   
                    </div>
                    <div className="draggable-inside">
                        <Tickers />
                    </div>
                </div>
                 <div key="b" data-grid={{x: 4, y: 0, w: 6, h:10, maxH:16}}>
                    <div className="draggable-handle">
                        <div className="handle-title">
                            Trades
                        </div>   
                    </div>
                    <div className="draggable-inside">
                        <Trades />
                    </div>
                </div>
            </ResponsiveReactGridLayout>
        </div>
      )
    }
}
Container.propTypes = {
    layout: PropTypes.object
};


export default connect(mapStateToProps)(Container);
