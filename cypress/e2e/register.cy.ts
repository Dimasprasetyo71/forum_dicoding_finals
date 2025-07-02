describe('Halaman Register dengan Konfirmasi Password', () => {
    beforeEach(() => {
        cy.visit('/register');
    });

    it('menampilkan field konfirmasi password', () => {
        cy.get('input[name="confirmPassword"]').should('be.visible');
    });

    it('menampilkan error jika konfirmasi password kosong', () => {
        cy.get('input[name="name"]').type('Tester User');
        cy.get('input[name="email"]').type(`tester${Date.now()}@test.com`);
        cy.get('input[name="password"]').type('StrongPassword1!');
        cy.get('button[type="submit"]').click();

        cy.contains('Konfirmasi password wajib diisi').should('exist');
    });

    it('menampilkan error jika konfirmasi password tidak sama', () => {
        cy.get('input[name="name"]').type('Tester User');
        cy.get('input[name="email"]').type(`tester${Date.now()}@test.com`);
        cy.get('input[name="password"]').type('StrongPassword1!');
        cy.get('input[name="confirmPassword"]').type('DifferentPassword!');
        cy.get('button[type="submit"]').click();

        cy.contains('Konfirmasi password tidak cocok').should('exist');
    });

    it('berhasil register jika konfirmasi password sama', () => {
        const random = Math.floor(Math.random() * 100000);
        cy.get('input[name="name"]').type(`User Test ${random}`);
        cy.get('input[name="email"]').type(`user${random}@test.com`);
        cy.get('input[name="password"]').type('StrongPassword1!');
        cy.get('input[name="confirmPassword"]').type('StrongPassword1!');
        cy.get('button[type="submit"]').click();

        cy.contains('Registrasi berhasil!').should('be.visible');
    });
});
