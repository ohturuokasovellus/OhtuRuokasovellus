import { captureRef } from 'react-native-view-shot';
import QRGenerator from './QRGenerator';

/**
 * 
 * @param {View} QRView
 */
function ViewToQR(QRView){
    captureRef(QRView, {
        format: 'jpg',
        quality: 0.8,
    }).then(
        (uri) => console.log('Image saved to', uri),
        (error) => console.error('Oops, snapshot failed', error)
    );
}

function ExportQRAsImage(qrUrl){
    console.log(qrUrl)
    console.log(process.env.EXPO_PUBLIC_WEBSITE_URL)
    //const qrView = QRGenerator(qrUrl);
    //ViewToQR(qrView);
}

export {ExportQRAsImage};