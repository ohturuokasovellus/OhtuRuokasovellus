import { useContext } from 'react';
import Slider from '@react-native-community/slider';
import { themeContext } from '../../controllers/themeController';

const CustomSlider = ({ minVal, maxVal, value, onValueChange }) => {
    const { colors } = useContext(themeContext);
    return (
        <Slider
            minimumValue={minVal}
            maximumValue={maxVal}
            step={1}
            value={value}
            onValueChange={value => onValueChange(value)}
            minimumTrackTintColor={colors.secondary}
            maximumTrackTintColor={colors.outline}
            thumbTintColor={colors.secondary}
        />
    );
};

export { CustomSlider as Slider };
