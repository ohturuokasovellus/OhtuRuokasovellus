import QRGenerator from '../components/QRGenerator'

describe('QRGenerator', () => {
  test('QRGenerator returns a qr', () => {
    const qr = QRGenerator('moi');
    expect(qr.props.value).toBe('moi');
    });
});