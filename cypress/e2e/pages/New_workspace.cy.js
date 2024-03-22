it('Loads the login page', () => {
  cy.visit('/login'); // Assuming the login page URL is '/login'
  cy.contains(`Welcome to initializ! 👋🏻`); // Verify page content
});

it('To create new workspace ', () => {
  cy.visit('/login');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=user-email-input]').clear().type('lrawat@initializ.io');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=auth-login-v2-password]').clear().type('Password@1');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/workspace');
  cy.get('.css-fnrg6y-MuiButtonBase-root-MuiIconButton-root').click()
  cy.get('.css-6bpq2m-MuiButtonBase-root-MuiListItemButton-root').click()
  cy.get('.Mui-selected').click()
  cy.get('.MuiCollapse-wrapperInner > :nth-child(3) > .MuiButtonBase-root').click()
  cy.get('.layout-page-content > .MuiPaper-root')
  // cy.get('input[name="workspace_name"]').type('Test Workspace');
  // cy.get('.MuiGrid-grid-xs-12 > .MuiButtonBase-root').click()
  // cy.get('.css-r2m3k7-MuiButtonBase-root-MuiButton-root').click()
  // cy.get('.css-2eofjy-MuiButtonBase-root-MuiButton-root').click()
})

it('To add new usser in settings tab in current workspace ', () => {
  cy.visit('/login');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=user-email-input]').clear().type('lrawat@initializ.io');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=auth-login-v2-password]').clear().type('Password@1');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/workspace');
  cy.get('.css-2eofjy-MuiButtonBase-root-MuiButton-root').click()
  cy.get('[style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;"] > .MuiButtonBase-root').click()
  cy.get('#userEmail').click()
  cy.get('#menu- > .MuiPaper-root > .MuiList-root > [tabindex="0"]').click()
  cy.get('#roleSelect').click()
  cy.get('#menu- > .MuiPaper-root > .MuiList-root > [tabindex="0"]').click()
  cy.get('.MuiDialogContent-root > .MuiButtonBase-root').click()
  cy.get(':nth-child(2) > :nth-child(5) > .MuiButtonBase-root').click()
  cy.get('.css-10nakn3-MuiModal-root-MuiPopover-root-MuiMenu-root > .MuiPaper-root > .MuiList-root > [tabindex="0"]').click()
  cy.get('#roleSelect').click()
  cy.get('#menu- > .MuiPaper-root > .MuiList-root > [tabindex="-1 "]').click()
})

it('To remove user in settings tab in current workspace ', () => {
  cy.visit('/login');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=user-email-input]').clear().type('lrawat@initializ.io');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=auth-login-v2-password]').clear().type('Password@1');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/workspace');
  cy.get('.css-2eofjy-MuiButtonBase-root-MuiButton-root').click()
  cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(5) > .MuiButtonBase-root').click()
})

it('To destroy current workspace', () => {
  cy.visit('/login');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=user-email-input]').clear().type('lrawat@initializ.io');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=auth-login-v2-password]').clear().type('Password@1');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/workspace');
  cy.get('.css-2eofjy-MuiButtonBase-root-MuiButton-root').click()
  // cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(5) > .MuiButtonBase-root').click()
  cy.get('.MuiGrid-container > :nth-child(3) > .MuiBox-root > .MuiButtonBase-root').click()
  cy.get('.MuiDialogActions-root > .MuiButton-contained').click()
})