it('After Login , we have to check the App settings in settings page page ', () => {
    cy.visit('/login');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=user-email-input]').clear().type('lrawat@initializ.io');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=auth-login-v2-password]').clear().type('Password@1');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 30000 }).should('include', '/workspace/65e59643f44aaafb7e7e4bb6/');
    cy.get(':nth-child(1) > [style="font-size: 14px; font-weight: bold; color: rgb(115, 83, 229);"]').click()
    cy.get('[data-testid="Settings"]').click()
    cy.get('form > .MuiGrid-container > :nth-child(2) > .MuiBox-root > .MuiButtonBase-root').click()
    cy.get('#no_of_Instances').click()
    cy.get('[data-value="Small"]').click()
    cy.get(':nth-child(2) > .MuiBox-root > .MuiButton-containedPrimary').click()
})


it('After Login , we have to check the Env variables App settings page ', () => {
    cy.visit('/login');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=user-email-input]').clear().type('lrawat@initializ.io');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=auth-login-v2-password]').clear().type('Password@1');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 30000 }).should('include', '/workspace/65e59643f44aaafb7e7e4bb6/');
    cy.get(':nth-child(1) > [style="font-size: 14px; font-weight: bold; color: rgb(115, 83, 229);"]').click()
    cy.get('[data-testid="Settings"]').click()
    cy.get('.css-1csvhd8-MuiGrid-root > :nth-child(2) > .MuiBox-root > .MuiButtonBase-root').click()
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    // cy.get('input[id=user-prod]').clear().type('abc');
    cy.get('.MuiDialogActions-root > .MuiButton-text').click()

})


