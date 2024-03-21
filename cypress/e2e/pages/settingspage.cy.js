it('To add new user in setting page  ', () => {
    cy.visit('/login');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=user-email-input]').clear().type('lrawat@initializ.io');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=auth-login-v2-password]').clear().type('Password@1');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/workspace');
    cy.get('.css-fnrg6y-MuiButtonBase-root-MuiIconButton-root').click()
    cy.get('.css-6bpq2m-MuiButtonBase-root-MuiListItemButton-root').click()
    cy.get('.MuiList-root > :nth-child(5) > .MuiButtonBase-root').click()
    cy.get('[style="display: flex; justify-content: flex-end; margin: 20px;"] > .MuiButtonBase-root').click()
    cy.get('input[id=user-email-address]').type("ssingh@initializ.io")
    cy.get('input[id=user-username]').click()
    // cy.get('#user-username').click()
    cy.get('#role-select').click()
    cy.get('[data-value="workspace-admin"]').click()
    cy.get('#workspace-select').click()
    cy.get('[data-value="65a6c8cf5431c2c07cfc62a2"]').click()
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click()
})

it('To create new user in settings page ', () => {
    cy.visit('/login');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=user-email-input]').clear().type('lrawat@initializ.io');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=auth-login-v2-password]').clear().type('Password@1');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/workspace');
    cy.get('.css-fnrg6y-MuiButtonBase-root-MuiIconButton-root').click()
    cy.get('.css-6bpq2m-MuiButtonBase-root-MuiListItemButton-root').click()
    cy.get('.MuiList-root > :nth-child(5) > .MuiButtonBase-root').click()
    cy.get(':nth-child(2) > :nth-child(5) > .MuiButtonBase-root').click()
    cy.get('.css-10nakn3-MuiModal-root-MuiPopover-root-MuiMenu-root > .MuiPaper-root > .MuiList-root > [tabindex="0"]').click()
    cy.get('#role-select').click()
    cy.get('[data-value="developer"]').click()
    cy.get('#workspace-select').click()
    cy.get('[data-value="65a6c8cf5431c2c07cfc62a2"]').click()
    cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click()
})


it('To Remove user in settings page ', () => {
    cy.visit('/login');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=user-email-input]').clear().type('lrawat@initializ.io');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[id=auth-login-v2-password]').clear().type('Password@1');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/workspace');
    cy.get('.css-fnrg6y-MuiButtonBase-root-MuiIconButton-root').click()
    cy.get('.css-6bpq2m-MuiButtonBase-root-MuiListItemButton-root').click()
    cy.get('.MuiList-root > :nth-child(5) > .MuiButtonBase-root').click()
    cy.get(':nth-child(2) > :nth-child(5) > .MuiButtonBase-root').click()
    cy.get('.css-10nakn3-MuiModal-root-MuiPopover-root-MuiMenu-root > .MuiPaper-root > .MuiList-root > [tabindex="-1"]').click()
    cy.get('.MuiDialogActions-root > .MuiButton-contained').click()
})