import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Platform, ScrollView } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useParams } from '../Router';
import { Button } from './ui/Buttons';
import QRCode from 'react-qr-code';
import createStyles from '../styles/styles';
import { getPageURL } from '../utils/getPageUrl';

const QRDownload = () => {
    const {t} = useTranslation();
    const { mealPurchaseCode } = useParams();
    const { restaurantId } = useParams();
    const [downloadId, setDownloadId] = useState('download-meal-qr-code');
    const [QRId, setQRId] = useState('meal-qr-code');
    const [pageText, setPageText] = useState('');
    const [qrCode, setQRCode] = useState('');
    const qrViewReference = useRef(null);
    const styles = createStyles();

    useEffect(() => {
        const fetchWebpageURL = async () => {
            const webpageURL = await getPageURL();
            if (webpageURL) {
                let urlToConfirm;
                if(mealPurchaseCode === undefined) {
                    setQRId('menu-qr-code');
                    setDownloadId('download-menu-qr-code');
                    setPageText(t('QR_CODE_TO_YOUR_MENU'));
                    urlToConfirm = webpageURL+'/restaurant/'+restaurantId;
                } 
                else {
                    setQRId('meal-qr-code');
                    setDownloadId('download-meal-qr-code');
                    setPageText(t('QR_CODE_TO_MEAL_CONFIRM'));
                    urlToConfirm = webpageURL+'/purchase/'+mealPurchaseCode;
                }
                setQRCode(urlToConfirm);
            } else {
                console.log('couldnt get webpage URL');
            }
        };

        void fetchWebpageURL();
    }, [mealPurchaseCode, restaurantId]);

    const getQR = async () => {
        try {
            if (qrViewReference.current){
                const uri = await captureRef(qrViewReference, {
                    format: 'jpg',
                    quality: 1,
                });
                if(mealPurchaseCode === undefined)
                {
                    void download(uri, 'menu_QR.jpg');
                } else {
                    void download(uri, 'meal_purchase_QR.jpg');
                }
            }
        } catch (error) {
            console.error(error);
        }
    };    
    
    const download = async (uri, fileName) => {
        if (Platform.OS === 'web') {
            // eslint-disable-next-line no-undef
            const link = document.createElement('a');
            link.href = uri;
            link.download = fileName;
            // eslint-disable-next-line no-undef
            document.body.appendChild(link);
            link.click();
            // eslint-disable-next-line no-undef
            document.body.removeChild(link);
        } else {
            const fileUrl = FileSystem.documentDirectory + fileName;
            await FileSystem.writeAsStringAsync(fileUrl, uri);
            await Sharing.shareAsync(fileUrl);
        }
    };

    if (!qrCode) {
        return (
            <ScrollView style={styles.background}>
                <View style={styles.container}>
                    <Text style={styles.body}>Loading...</Text>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <View style={styles.qrPage}>
                    <Text>{pageText}</Text>
                    <View style={styles.qrContainer} ref={qrViewReference} 
                        id={QRId}>
                        <QRCode size={500} style={{ height: 'auto', 
                            maxWidth: '500px', width: '500px'}}
                        value={qrCode}/>
                    </View>
                    <Button styles={styles} onPress={getQR} 
                        text={t('DOWNLOAD')} id={downloadId}>
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
};

export default QRDownload;
