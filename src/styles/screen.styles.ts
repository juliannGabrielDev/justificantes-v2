import { StyleSheet } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

export const createScreenStyles = (insets: EdgeInsets) =>
    StyleSheet.create({
        screen: {
            paddingTop: insets.top + 72,
            paddingBottom: insets.bottom + 80,
            paddingHorizontal: 20,
            gap: 16,
        },
    });