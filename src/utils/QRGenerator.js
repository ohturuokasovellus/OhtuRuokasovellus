import React from 'react';
import QRCode from 'react-qr-code';

/**
 * A function that returns a react component of a QR code
 * @param {String} urlToBeGenerated 
 * @returns {QRCode}
 */
function QRGenerator(urlToBeGenerated) {
    return (
        <QRCode value={urlToBeGenerated} />
    );
}

export default QRGenerator;
