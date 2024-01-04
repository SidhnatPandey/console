it('Loads the login page', () => {
    cy.visit('/login'); // Assuming the login page URL is '/login'
    cy.contains(`Welcome to initializ! 👋🏻`); // Verify page content
  });

it('To create new workspace ', () => {
    cy.visit('/login');
    cy.get('input[id=user-email-input]').clear().type('lalit@initializ.io');
    cy.get('input[id=auth-login-v2-password]').clear().type('Password@1');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/app');
    cy.get('.css-fnrg6y-MuiButtonBase-root-MuiIconButton-root').click()
    cy.get('.css-6bpq2m-MuiButtonBase-root-MuiListItemButton-root').click()
    cy.get(':nth-child(9) > .MuiButtonBase-root').click()
    cy.get('.MuiGrid-container > :nth-child(1)')
    cy.get('.layout-page-content > .MuiPaper-root')
    cy.get('input[name="workspace_name"]').type('Test Workspace');
    cy.get('.MuiGrid-grid-xs-12 > .MuiButtonBase-root').click()
})

