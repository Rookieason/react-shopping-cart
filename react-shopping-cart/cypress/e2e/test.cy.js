/// <reference types="cypress" />

const availableSizes = [{size:'XS', have:1}, {size:'S', have:2}, {size:'M', have:1}, {size:'ML', have:2}, {size:'L', have:10}, {size:'XL', have:10}, {size:'XXL', have:4}];

describe('shopping-cart test', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
    })
    it('商品展示', () => {
        cy.get('div[tabIndex=1]').should('have.length', 16)
        cy.get('div[tabIndex=1]:contains(Free shipping)').should('have.length', 13)
    })
    it('篩選商品', () => {
        availableSizes.map((item) => {
            cy.get(`input[value=${item.size}]`).parent().click()
            cy.get('div[tabIndex=1]').should('have.length', item.have)
            cy.get(`input[value=${item.size}]`).parent().click()
        })
    })
    it('檢查購物', () => {
        // 商品加入購物車確認數量後關閉
        cy.contains("Cropped Stay Groovy off white").parent().find('button').click()
        cy.get('span').contains(new RegExp("^X$", "g")).click()
        cy.contains("Basic Cactus White T-shirt").parent().find('button').click()
        cy.contains("Cart").siblings().should('have.text', 2)
        cy.get('span').contains(new RegExp("^X$", "g")).click()
        // 打開購物車側欄確認金額無誤
        cy.get('[title="Products in cart quantity"]').parent().click()
        cy.contains('SUBTOTAL').siblings().should('include.text', 24.15)
        //調整購物(新增)
        cy.get('[alt="Cropped Stay Groovy off white"]').siblings().contains('+').click()
        cy.get('[alt="Basic Cactus White T-shirt"]').siblings().contains('+').click()
        cy.contains('SUBTOTAL').siblings().should('include.text', 48.30)
        cy.contains('SUBTOTAL').siblings().should('include.text', '9 x $ 5.37')
        //調整購物(減少)
        cy.get('[alt="Cropped Stay Groovy off white"]').siblings().contains(new RegExp("^-$", "g")).click()
        cy.contains('SUBTOTAL').siblings().should('include.text', 37.40)
        cy.contains('SUBTOTAL').siblings().should('include.text', '9 x $ 4.16')
        //調整購物(打叉)
        cy.get('[alt="Cropped Stay Groovy off white"]').siblings('button[title="remove product from cart"]').click()
        cy.contains('SUBTOTAL').siblings().should('include.text', 26.50)
        cy.contains('SUBTOTAL').siblings().should('include.text', '3 x $ 8.83')
        //結帳
        cy.contains('Checkout').click()
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Checkout - Subtotal: $ 26.50')
        })
    })
    
})