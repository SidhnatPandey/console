import React from 'react'
import Register from './index'

describe('<Register />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Register />)
  })
})