import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import { withInfo } from '@storybook/addon-info'

import Button from './index'

storiesOf('Button', module)
    .addDecorator(withKnobs)
    .add('default', withInfo('Default Button')(() => {

    const disabled = boolean('disabled', false)

    return (<Button content={'Hello'} disabled={disabled} />)
}))
