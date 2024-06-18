import { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { themeContext } from '../../controllers/themeController';

const CircularProgressBar = ({ percentage }) => {
    const { theme, colors } = useContext(themeContext);
    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            marginTop: 16,
        },
        label: {
            fontSize: 32,
            fontFamily: 'Roboto-Regular',
            color: colors.onSurface,
        },
    });
    const bgColor = theme === 'dark' ? colors.primary : colors.primaryContainer;
    const barColor = theme === 'dark' ? colors.onPrimary : colors.primary;
    return (
        <View style={styles.container}>
            <AnimatedCircularProgress
                rotation={360}
                lineCap='round'
                size={150}
                width={24}
                fill={percentage}
                tintColor={barColor}
                backgroundColor={bgColor}
                padding={4}
            >
                {() => (
                    <Text style={styles.label}>
                        {`${percentage}%`}
                    </Text>
                )}
            </AnimatedCircularProgress>
        </View>
    );
};

export { CircularProgressBar };
