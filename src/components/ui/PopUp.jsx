import React, { useContext } from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { themeContext } from '../../controllers/themeController';
import { DeleteButton, CancelButton } from './Buttons';

const DeletePopUp = ({showModal, setShowModal, onDelete}) => {
    const styles = createStyles();
    const { t } = useTranslation();
    return (
        <Modal
            visible={showModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowModal(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>
                        {t('CONFIRM_DELETE')}
                    </Text>
                    <View style={styles.modalButtonContainer}>
                        <CancelButton styles={styles}
                            onPress={() => setShowModal(false)}
                            id="cancel-button"
                        />
                        <DeleteButton styles={styles}
                            onPress={onDelete}
                            id="confirm-delete-button"
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const createStyles = () => {
    const { colors } = useContext(themeContext);
    return StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            maxWidth: 300,
            width: '100%',
            padding: 20,
            backgroundColor: colors.surface,
            borderRadius: 10,
            alignItems: 'center',
        },
        modalText: {
            fontSize: 18,
            fontFamily: 'Roboto-Regular',
            color: colors.onSurface,
            marginBottom: 20,
        },
        modalButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        },
    });
};

export { DeletePopUp };
