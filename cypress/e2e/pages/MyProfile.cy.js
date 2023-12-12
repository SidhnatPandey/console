it('Loads the login page', () => {
    cy.visit('/login'); // Assuming the login page URL is '/login'
    cy.contains(`Welcome to initializ! 👋🏻`); // Verify page content
  });

it('After click My Profile , My Profile page opens and we will edit the profile Imformation and save thaat changes', () => {
    cy.visit('/login');
    cy.get('input[id=user-email-input]').clear().type('jagpreet@initializ.io');
    cy.get('input[id=auth-login-v2-password]').clear().type('Password@1');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/app');
    cy.get('.MuiAvatar-img').click()
    cy.get('.MuiList-root > :nth-child(3) > .MuiBox-root').click()
    cy.get('.css-ho56md > .MuiButtonBase-root').click()
    cy.get('[href="/settings/teams/"] > .MuiButtonBase-root').click()
    cy.get('[href="/settings/accounts/"] > .MuiButtonBase-root').click()
    cy.get('.css-xpxm7f').click()
    cy.get('.MuiSelect-select').click()
    cy.get('[data-value="Hong Kong"]').click()
    cy.get('.css-1rfp457-MuiGrid-root > .MuiButton-contained').click()
})

it('After click My Profile , My Profile page opens and we will edit the profile Imformation and save thaat changes', () => {
    cy.visit('/login');
    cy.get('input[id=user-email-input]').clear().type('jagpreet@initializ.io');
    cy.get('input[id=auth-login-v2-password]').clear().type('Password@1');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/app');
    cy.get('.MuiAvatar-img').click()
    cy.get('.MuiList-root > :nth-child(3) > .MuiBox-root').click()
    cy.get('.css-ho56md > .MuiButtonBase-root').click()
    cy.get('[href="/settings/teams/"] > .MuiButtonBase-root').click()
    cy.get('[href="/settings/accounts/"] > .MuiButtonBase-root').click()
    cy.get('.PrivateSwitchBase-input').click()
    cy.get('form > .MuiButton-root').click()
    cy.get('.MuiDialogActions-root > .MuiButton-contained').click(  )

  
})