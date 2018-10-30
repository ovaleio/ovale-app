// This helper can be used to parse numbers

const numberFormat = {
    removeTrailingZeros: (value) => {
        value = value.toString();
    
        if (value.indexOf('.') === -1) {
            return value;
        }
        while((value.slice(-1) === '0' || value.slice(-1) === '.') && value.indexOf('.') !== -1) {
            value = value.substr(0, value.length - 1);
        }
        return value;
    },

    format: (number, precision, trailingZeros=true, charLimit=8) => {
        // toFixed precision
        let output = number.toFixed(precision)

        // remove unused zeros if true
        output = (trailingZeros)?numberFormat.removeTrailingZeros(output, charLimit):output;

        // Trim to charlimit
        output = output.substr(0, charLimit+1);

        return output;
    }
    
}


export default numberFormat;