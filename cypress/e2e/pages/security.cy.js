it('Loads the login page', () => {
    cy.visit('/login'); // Assuming the login page URL is '/login'
    cy.contains(`Welcome to initializ! 👋🏻`); // Verify page content
  });


  it('To check the security screen ', () => {
    cy.visit('/login');
    cy.get('input[id=user-email-input]').type('lrawat@initializ.io');
    cy.get('input[id=auth-login-v2-password]').type('Password@1');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 30000 }).should('include', '/workspace/65a65ff87915132683c4c3ed/');
    
    cy.get('.css-fnrg6y-MuiButtonBase-root-MuiIconButton-root').click()
    cy.get('.css-6bpq2m-MuiButtonBase-root-MuiListItemButton-root').click()
    cy.get('.Mui-selected').click()
    cy.get('.MuiList-root > :nth-child(3) > .MuiButtonBase-root').click()
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(1) > a').click()
    cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').type('DemoSec')

    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(1) > a').click()
});