import { configure } from '@storybook/react'

function loadStories() {
    require('../renderer/bootstrap/Button/story')
}

configure(loadStories, module)
