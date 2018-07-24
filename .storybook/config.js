import { configure } from '@storybook/react'

function loadStories() {
    require('../src/bootstrap/Button/story')
}

configure(loadStories, module)
