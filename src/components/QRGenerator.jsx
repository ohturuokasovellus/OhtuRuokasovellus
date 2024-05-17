import React from "react";
import QRCode from "react-qr-code";

const QRGenerator = (urlToBeGenerated)  => {
    return (
        <QRCode value={urlToBeGenerated} />
    );
}

export default QRGenerator;