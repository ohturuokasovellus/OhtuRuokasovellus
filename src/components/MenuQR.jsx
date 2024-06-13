import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { Platform } from 'react-native';
import { useParams, Link } from '../Router';
import apiUrl from '../utils/apiUrl';
import QRCode from 'react-qr-code';

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
    const [menuQRCode, setmenuQRCode] = useState('');
    const qrViewReference = useRef(null);
    const [imageUri, setImageUri] = useState('');

    useEffect(() => {
        const fetchWebpageURL = async () => {
            const webpageURL = await getPageURL();
            if (webpageURL) {
                const urlMenu = webpageURL+'/restaurant/'+restaurantId;
                setmenuQRCode(urlMenu);
            } else {
                console.log('couldnt get webpage URL');
            }
        };

        fetchWebpageURL();
    }, [restaurantId]);

    useEffect(() => {
        const formImage = async () => {
            if (qrViewReference.current){
                const uri = await captureRef(qrViewReference, {
                    format: 'jpg',
                    quality: 0.8,
                });
                setImageUri(uri);
            }
        };

        if (menuQRCode) {
            formImage();
        }
    }, [menuQRCode]);

    if (!menuQRCode) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    if(Platform.OS === 'web'){
        return (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text>{t('QR_CODE_TO_YOUR_MENU')}</Text>
                <View ref={qrViewReference}>
                    <QRCode value={menuQRCode}/>
                </View>
                <Link to={imageUri} 
                    target="_blank" download>Download</Link>
            </View>
        );
    }

    return null; // Handle non-web platforms or other cases when needed
};

export default MenuQR;
