import { StyleSheet } from "react-native";
import { COLORS } from "../themes/theme";

export const CommonStyle = StyleSheet.create({
    RowFlexStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ColumnFlexStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
