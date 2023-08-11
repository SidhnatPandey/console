/* describe("test", () => {
    it("test login page", () => {
        cy.visit("http://localhost:3000/");
        cy.get('.css-z0xj7h > .css-1b10xk1-MuiTypography-root').click()
    })
}) */

// cypress/integration/register.spec.js

describe('Register Form', () => {
    it('successfully submits the form with valid input', () => {
        cy.visit('/register'); // Replace with your actual register page URL

        // Interact with form inputs
        //cy.get('form > :nth-child(1)').type('testUser1')
        //cy.get('#\:r0\:').type('testuser')
        cy.get('input[name="username"]').type('testuserc');
        cy.get('input[name="email"]').type('testc@example.com');
        cy.get('input[name="password"]').type('P@ssw0rd1');
        cy.get('input[name="org"]').type('testc');
        cy.get('.PrivateSwitchBase-input').click();
        // Submit the form
        cy.get('button[type="submit"]').click();

        // Assert that registration was successful
        cy.url().should('eq', 'http://localhost:3000/login'); // Replace with expected redirect URL
        cy.get('.success-message').should('contain', 'Registration successful'); // Replace with appropriate success message selector
    });

    /* it('displays an error message for invalid input', () => {
        cy.visit('/register');

        // Interact with form inputs
        cy.get('input[name="username"]').type('ff'); // Invalid empty username
        cy.get('input[name="email"]').type('invalid-email'); // Invalid email format
        cy.get('input[name="password"]').type('short'); // Invalid short password
        cy.get('input[name="password"]').type('Password'); // Invalida Long password
        //cy.get('input[name="org"]').type('testb');
        //cy.get('.PrivateSwitchBase-input').click();

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Assert error messages
        cy.get('.error-message').should('have.length', 4); // Replace with appropriate error message selector and count
    }); */
});
