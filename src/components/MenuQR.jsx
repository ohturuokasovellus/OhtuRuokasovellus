import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Platform, ScrollView } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { useParams, Link } from '../Router';
import { Button } from './ui/Buttons';
import apiUrl from '../utils/apiUrl';
import QRCode from 'react-qr-code';
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
    const [menuQRCode, setmenuQRCode] = useState('');
    const qrViewReference = useRef(null);
    const [imageUri, setImageUri] = useState('');
    const styles = createStyles();

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
                    quality: 1,
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
            <ScrollView style={styles.background}>
                <View style={styles.container}>
                    <Text style={styles.body}>Loading...</Text>
                </View>
            </ScrollView>
        );
    }

    if(Platform.OS === 'web'){
        return (
            <ScrollView style={styles.background}>
                <View style={styles.container}>
                    <View style={styles.qrPage}>
                        <Text>{t('QR_CODE_TO_YOUR_MENU')}</Text>
                        <View style={styles.qrContainer} ref={qrViewReference} 
                            id='QR-code'>
                            <QRCode size={500} style={{ height: 'auto', 
                                maxWidth: '500px', width: '500px'}}
                            value={menuQRCode}/>
                        </View>
                        <Link
                            style={{textDecorationLine: 'none'}}
                            to={imageUri} target="_blank" download
                        >
                            <Button styles={styles} onPress={()=>{}} 
                                text={t('DOWNLOAD')} id='Download-QR-code'>
                            </Button>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        );
    }

    return null; // Handle non-web platforms or other cases when needed
};

export default MenuQR;
