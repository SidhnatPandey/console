it('After click create button , three landing screens are opened', () => {
    cy.visit('/login');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=user-email-input]').clear().type('lrawat@initializ.io');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=auth-login-v2-password]').clear().type('Password@1');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 30000 }).should('include', '/workspace/65e59643f44aaafb7e7e4bb6/');
    cy.get('.css-1alwz6k-MuiButtonBase-root-MuiIconButton-root').click()
    cy.get(':nth-child(4) > .MuiButtonBase-root > .MuiBox-root > .MuiTypography-root').click()
    cy.get('[style="flex-direction: column; min-width: 190px;"] > div > .MuiButtonBase-root').click()
    cy.get('.MuiPaper-root > .MuiList-root > :nth-child(2)').click()
    cy.get('.css-3tpzgc > .MuiButtonBase-root').click()
    cy.get('.MuiDialogActions-root > .MuiButton-contained').click()
})