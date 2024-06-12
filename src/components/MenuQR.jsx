import axios from 'axios';
import { useTranslation } from 'react-i18next';
import QRGenerator from '../utils/QRGenerator';
import { useParams } from '../Router';
import { View, Text } from 'react-native';
import apiUrl from '../utils/apiUrl';
import { useEffect, useState } from 'react';

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
            <QRGenerator urlToBeGenerated={menuQRCode}/>
        </View>
    );
};

export default MenuQR;
