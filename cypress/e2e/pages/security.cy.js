it('To check the security screen while prod and current button is working fine. ', () => {
  cy.visit('https://console.dev.initializ.ai/login/');
  cy.get('input[id=user-email-input]').type('lrawat@initializ.io');
  cy.get('input[id=auth-login-v2-password]').type('Password@1');
  cy.get('button[type="submit"]').click();
  cy.url({ timeout: 30000 }).should('include', '/workspace/65a65ff87915132683c4c3ed/');
  cy.get('.css-hqz9my').click()
  cy.get('.Mui-selected').click()
  cy.get('.MuiList-root > :nth-child(3) > .MuiButtonBase-root').click()
  cy.get('[value="prod"]').click()
})
 
it('To check the security screen whether search button functionality is workin ', () => {
  cy.visit('https://console.dev.initializ.ai/login/');
  cy.get('input[id=user-email-input]').type('lrawat@initializ.io');
  cy.get('input[id=auth-login-v2-password]').type('Password@1');
  cy.get('button[type="submit"]').click();
  cy.url({ timeout: 30000 }).should('include', '/workspace/65a65ff87915132683c4c3ed/');
  cy.get('.css-hqz9my').click()
  cy.get('.Mui-selected').click()
  cy.get('.MuiList-root > :nth-child(3) > .MuiButtonBase-root').click()
  cy.get('.MuiBox-root > .MuiInputBase-root').click().type('DemoSec')
})
 
it('To check the security screen is redirecting succesully ', () => {
  cy.visit('https://console.dev.initializ.ai/login/');
  cy.get('input[id=user-email-input]').type('lrawat@initializ.io');
  cy.get('input[id=auth-login-v2-password]').type('Password@1');
  cy.get('button[type="submit"]').click();
  cy.url({ timeout: 30000 }).should('include', '/workspace/65a65ff87915132683c4c3ed/');
  cy.get('.css-hqz9my').click()
  cy.get('.Mui-selected').click()
  cy.get('.MuiList-root > :nth-child(3) > .MuiButtonBase-root').click()
  cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(1) > a').click()
  cy.get(':nth-child(2) > :nth-child(1) > a').click()
});