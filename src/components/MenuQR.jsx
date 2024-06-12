import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { useParams } from '../Router';
import { Button } from './ui/Buttons';
import apiUrl from '../utils/apiUrl';
import QRGenerator from '../utils/QRGenerator';
import createStyles from '../styles/styles';

async function getPageURL(){
    try {
        const response = await axios.get(
            `${apiUrl}/webpageURL/`
        );
        const webpageURL = response.data;
        return webpageURL;
    } catch (err) {
        console.error(err);
        return null;
    }
}

const MenuQR = () => {
    const {t} = useTranslation();
    const { restaurantId } = useParams();
    let [menuQRCode, setmenuQRCode] = useState('');
    const styles = createStyles();
    const qrViewReference = useRef();

    const downloadImage = async () => {
        try {
            // react-native-view-shot captures component
            const uri = await captureRef(qrViewReference, {
                format: 'jpg',
                quality: 0.8,
            });

        } catch (error) {
            console.log('error', error);
        }
    };


    useEffect(() => {
        const fetchWebpageURL = async () => {
            const webpageURL = await getPageURL();
            if (webpageURL) {
                const urlMenu = webpageURL+'/restaurant/'+restaurantId;
                setmenuQRCode(urlMenu);
            } else {
                console.log('couldnt get webpage url');
            }
        };

        fetchWebpageURL();
    }, []);

    if (!menuQRCode) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text>{t('QR_CODE_TO_YOUR_MENU')}</Text>
            <QRGenerator urlToBeGenerated={menuQRCode} ref={qrViewReference}/>
            <Button
                styles={styles}
                onPress={() => downloadImage()}
                text={t('EXPORT_MENU_QR')}
                id='export-qr-button'
            />
        </View>
    );
};

export default MenuQR;
