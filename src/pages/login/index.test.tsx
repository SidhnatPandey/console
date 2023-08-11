import React from 'react'
import LoginPage from './index'
import { render, screen } from '@testing-library/react'

describe("Login page", () => {
    it("Submit Button", () => {
        render(<LoginPage />);

    })
})