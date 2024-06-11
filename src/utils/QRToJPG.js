import { captureRef } from 'react-native-view-shot';
import QRGenerator from './QRGenerator';

/**
 * 
 * @param {View} QRView
 */
async function ViewToQR(QRView){
    captureRef(QRView, {
        format: 'jpg',
        quality: 0.8,
    }).then(
        (uri) => console.log('Image saved to', uri),
        (error) => console.error('Oops, snapshot failed', error)
    );
}

async function ExportQRAsImage(qrUrl){
    const restaurantUrl = process.env.EXPO_PUBLIC_WEBSITE_URL + qrUrl;
    const qrView = QRGenerator(restaurantUrl);
    await ViewToQR(qrView);
}

export {ExportQRAsImage};