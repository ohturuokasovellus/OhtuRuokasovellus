const { generatePurchaseCode } = require('../services/random');

describe('random', () => {
    test('purchase code meets criteria', () => {
        const purchaseCode = generatePurchaseCode();
        expect(purchaseCode).toMatch(/^[a-z0-9]{8}$/);
    });

    test('purchase code is generated randomily', () => {
        const code1 = generatePurchaseCode();
        const code2 = generatePurchaseCode();
        expect(code1).not.toBe(code2);
    });
});
