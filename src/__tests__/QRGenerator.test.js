import QRGenerator from '../components/QRGenerator';

describe('QRGenerator', () => {
    test('QRGenerator returns a qr', () => {
        const qrGenerator = QRGenerator('moi');
        expect(qrGenerator.props.value).toBe('moi');
    });
});