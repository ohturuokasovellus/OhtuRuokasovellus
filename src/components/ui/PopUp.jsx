import React, { useContext } from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { themeContext } from '../../controllers/themeController';
import { Button, DeleteButton, CancelButton } from './Buttons';

/**
 * Delete pop up.
 * @param {Boolean} showModal true if activated
 * @param {Function} onDelete
 * @returns {JSX.Element} 
 */
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
                        <CancelButton
                            onPress={() => setShowModal(false)}
                            id="cancel-button"
                        />
                        <DeleteButton
                            onPress={onDelete}
                            id="confirm-delete-button"
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

/**
 * Confirmation pop up.
 * @param {Boolean} showModal true if activated
 * @param {String} message confirmation message
 * @param {Function} onConfirm
 * @returns {JSX.Element} 
 */
const ConfirmationPopUp = ({showModal, setShowModal, onConfirm, message}) => {
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
                        {t(message)}
                    </Text>
                    <View style={styles.modalButtonContainer}>
                        <CancelButton
                            onPress={() => setShowModal(false)}
                            id="cancel-button"
                        />
                        <Button
                            onPress={onConfirm}
                            text={t('CONFIRM')}
                            id="confirm-button"
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

export { DeletePopUp, ConfirmationPopUp };
