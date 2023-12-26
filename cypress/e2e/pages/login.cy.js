it('Loads the login page', () => {
    cy.visit('/login'); // Assuming the login page URL is '/login'
    cy.contains(`Welcome to initializ! 👋🏻`); // Verify page content
  });

it('After click create button , three landing screens are opened', () => {
    cy.visit('/login');
    cy.get('input[id=user-email-input]').clear().type('clouduser@initializ.io');
    cy.get('input[id=auth-login-v2-password]').clear().type('Password@1');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/app');
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(1)').click()
    // cy.get('.layout-page-content').click();
    cy.get('.MuiButton-root').click();
    cy.get(':nth-child(1) > .MuiStepLabel-root > .MuiStepLabel-labelContainer > .MuiStepLabel-label > .step-label').click();
    cy.get('input[placeholder="carterLeonard"]').type('test5');
    cy.get('input[value="primary"]').click();
    cy.get('.MuiSelect-select').click();
    cy.get('[data-value="initializ/api"]').click()
    // cy.get(':nth-child(5) > .MuiFormControl-root > .MuiInputBase-root > .MuiSelect-select')
    // cy.get('.MuiList-root > .MuiButtonBase-root').click();
    cy.get(':nth-child(5) > .MuiFormControl-root > .MuiInputBase-root > .MuiSelect-select').click()
    cy.get('[data-value="develop"]').click()
    // cy.get('.MuiList-root > .MuiButtonBase-root').click({ force: true });
    // cy.get('input[placeholder="Application Name"]').should('have.value', );
    cy.get('button[type="submit"]').contains('Next').click();


    cy.get('.MuiGrid-container > :nth-child(2) > div')
    cy.get('.MuiGrid-container > :nth-child(3) > :nth-child(1)')
    cy.get('.MuiGrid-container > :nth-child(3) > .MuiButtonBase-root').click()
    // cy.get(':nth-child(2) > .MuiGrid-grid-xs-1 > .MuiButtonBase-root').click()
    cy.get('.MuiDialogActions-root > .MuiButton-contained').click()

    cy.get('.MuiGrid-container > :nth-child(5)')
    cy.get('.MuiGrid-container > :nth-child(5)').should('be.visible').should('exist');
    cy.get('input[name="port"]').click();
    cy.get('input[name="http_path"]').click();
    cy.get('button[type="submit"]').contains('Next').click();
    cy.get('.css-16w9rr2-MuiGrid-root > .MuiButton-contained').click()
    cy.url().should('include', '/app-dashboard');

    cy.get('[data-testid="Overview"]').click()
    cy.get('[data-testid="Logs"]').click()
    cy.get('[data-testid="Settings"]').click()
});


