import {
	BottomSheetModal,
	BottomSheetView,
	type BottomSheetMethods,
} from "@expo/ui/community/bottom-sheet";
import { useEffect, useRef, type ReactNode } from "react";
import { StyleSheet } from "react-native";

import { StyledText } from "@/components/common/styled-text";
import {
	spacing,
	useStyles,
	useThemeColors,
	type ThemeColors,
} from "@/use-theme";

export interface BottomSheetProps {
	isPresented: boolean;
	onDismiss: () => void;
	title?: string;
	children: ReactNode;
}

function createStyles(c: ThemeColors) {
	return StyleSheet.create({
		content: {
			gap: spacing.lg,
			padding: spacing.xl,
			paddingBottom: 32,
		},
	});
}

export default function BottomSheet({
	isPresented,
	onDismiss,
	title,
	children,
}: BottomSheetProps) {
	const sheetRef = useRef<BottomSheetMethods>(null);
	const styles = useStyles(createStyles);
	const { colors } = useThemeColors();

	useEffect(() => {
		if (isPresented) {
			sheetRef.current?.present();
		} else {
			sheetRef.current?.dismiss();
		}
	}, [isPresented]);

	return (
		<BottomSheetModal
			ref={sheetRef}
			onDismiss={onDismiss}
			enablePanDownToClose
			handleComponent={null}
			backgroundStyle={{ backgroundColor: colors.surfaceContainer }}
		>
			<BottomSheetView style={styles.content}>
				{title && (
					<StyledText
						variant="headline"
						size="md"
						weight="extrabold"
						align="center"
						family="display"
						uppercase
					>
						{title}
					</StyledText>
				)}
				{children}
			</BottomSheetView>
		</BottomSheetModal>
	);
}
