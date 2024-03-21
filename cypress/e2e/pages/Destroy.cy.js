it('After click create button , three landing screens are opened', () => {
  cy.visit('/login');
  // eslint-disable-next-line cypress/unsafe-to-chain-command
  cy.get('input[id=user-email-input]').clear().type('lrawat@initializ.io');
  // eslint-disable-next-line cypress/unsafe-to-chain-command
  cy.get('input[id=auth-login-v2-password]').clear().type('Password@1');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/app');
    cy.get(':nth-child(1) > [style="font-size: 14px; font-weight: bold; color: rgb(115, 83, 229);"]').click()
    
    cy.get('[data-testid="Overview"]').click()
    cy.get('[data-testid="Logs"]').click()
    cy.get('[data-testid="Settings"]').click()
    cy.get('.MuiGrid-container > :nth-child(3) > .MuiBox-root > .MuiButtonBase-root').click
    cy.get('[data-testid="DeleteIcon"] > path').click()
    cy.get('.MuiDialogActions-root > .MuiButton-contained').click()
  });
  