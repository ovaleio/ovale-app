import React from 'react'
import PropTypes from 'prop-types'

// Style
// import './index.less'

const Button = (props) => {
    const {content, className, disabled} = props
    return (<button className={className} disabled={disabled} >
        {content}
    </button>)
}

export default Button

Button.propTypes = {
    content: PropTypes.string.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
}

Button.defaultProps = {
    disabled: false,
    className: ''
}
