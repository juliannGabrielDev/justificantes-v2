import { Image } from "expo-image";
import * as ExpoImagePicker from "expo-image-picker";
import { useState } from "react";
import {
	Pressable,
	StyleSheet,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { CameraIcon, PhotoIcon } from "react-native-heroicons/outline";
import { CloudArrowUpIcon, XCircleIcon } from "react-native-heroicons/solid";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { Button, useButtonContext } from "@/components/common/button";
import { StyledText } from "@/components/common/styled-text";
import BottomSheet from "@/components/ui/bottom-sheet";
import { useHaptics } from "@/hooks/use-haptics";
import {
	brand,
	radius,
	spacing,
	useStyles,
	useThemeColors,
	type ThemeColors,
} from "@/use-theme";
import { compressImageToUnder1Mb } from "@/utils/compress-image";

export interface ImagePickerProps {
	label: string;
	value?: string | null;
	onChange: (uri: string) => void;
	disabled?: boolean;
	required?: boolean;
	className?: string;
	style?: StyleProp<ViewStyle>;
}

function createStyles(c: ThemeColors) {
	return StyleSheet.create({
		root: {
			flexDirection: "column",
			gap: spacing.xs,
		},
		shadowBlock: {
			borderRadius: radius["3xl"],
			backgroundColor: c.shadow,
		},
		field: {
			flexDirection: "row",
			alignItems: "center",
			overflow: "hidden",
			minHeight: 48,
			borderRadius: radius["3xl"],
			borderWidth: 2,
			borderColor: c.outline,
			backgroundColor: c.surfaceContainer,
		},
		badge: {
			paddingBlock: spacing.md,
			paddingLeft: spacing.md,
			paddingRight: spacing.sm,
			borderRightWidth: 2,
			borderRightColor: c.outline,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: brand.primary,
		},
		valueText: {
			flex: 1,
			paddingTop: spacing.md,
			paddingBottom: spacing.md,
			paddingLeft: spacing.sm,
			paddingRight: spacing.md,
		},
		preview: {
			overflow: "hidden",
			aspectRatio: 310 / 158,
			borderRadius: radius["3xl"],
		},
		previewImage: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
		},
		removePill: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing.xs,
			paddingVertical: spacing.xs,
			paddingLeft: spacing.sm,
			paddingRight: spacing.md,
			borderRadius: radius["2xl"],
			backgroundColor: brand.primary,
		},
	});
}

function SheetIcon({
	icon: IconComponent,
}: {
	icon: React.ComponentType<{ size?: number; color?: string }>;
}) {
	const { contentColor } = useButtonContext();
	return <IconComponent size={20} color={contentColor} />;
}

export default function ImagePicker({
	label,
	value,
	onChange,
	disabled = false,
	required = false,
	className,
	style,
}: ImagePickerProps) {
	const styles = useStyles(createStyles);
	const { colors } = useThemeColors();
	const haptics = useHaptics();
	const offset = useSharedValue(0);
	const [sheetVisible, setSheetVisible] = useState(false);

	const surfaceStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: offset.get() - 2 }],
	}));

	const openPicker = () => {
		haptics.light();
		setSheetVisible(true);
	};

	const handlePicked = async (result: ExpoImagePicker.ImagePickerResult) => {
		if (result.canceled || !result.assets[0]) return;
		const asset = result.assets[0];
		const uri = await compressImageToUnder1Mb(asset.uri, asset.fileSize);
		onChange(uri);
	};

	const pickFromLibrary = async () => {
		setSheetVisible(false);
		const result = await ExpoImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			quality: 1,
		});
		await handlePicked(result);
	};

	const pickFromCamera = async () => {
		setSheetVisible(false);
		const result = await ExpoImagePicker.launchCameraAsync({
			quality: 1,
		});
		await handlePicked(result);
	};

	const removeImage = () => {
		haptics.light();
		onChange("");
	};

	const tap = Gesture.Tap()
		.enabled(!disabled)
		.runOnJS(false)
		.onBegin(() => {
			offset.set(withTiming(2, { duration: 100 }));
			scheduleOnRN(haptics.light);
		})
		.onFinalize(() => {
			offset.set(withTiming(0, { duration: 150 }));
		})
		.onEnd(() => {
			scheduleOnRN(openPicker);
		});

	const fileName = value
		? decodeURIComponent(value.split("/").pop() ?? "")
		: null;

	return (
		<View style={[styles.root, style]} className={className}>
			<StyledText variant="body" size="md" weight="bold" color="onSurface">
				{label}
				{required && <StyledText color={brand.danger}>*</StyledText>}
			</StyledText>

			<GestureDetector gesture={tap}>
				<View>
					<View style={styles.shadowBlock}>
						<Animated.View
							style={[styles.field, surfaceStyle, disabled && { opacity: 0.5 }]}
						>
							<View style={styles.badge}>
								<CloudArrowUpIcon size={24} color={colors.onSurfaceLight} />
							</View>
							<StyledText
								variant="body"
								size="md"
								weight="boldItalic"
								color="onSurfaceVariant"
								truncate
								style={styles.valueText}
							>
								{fileName ?? label}
							</StyledText>
						</Animated.View>
					</View>
				</View>
			</GestureDetector>

			{value && (
				<View style={styles.preview}>
					<Image
						source={{ uri: value }}
						style={styles.previewImage}
						contentFit="cover"
					/>
					<View
						style={{
							flex: 1,
							padding: spacing.lg,
							alignItems: "flex-end",
							justifyContent: "flex-end",
						}}
					>
						<Pressable onPress={removeImage} hitSlop={8}>
							<View style={styles.removePill}>
								<XCircleIcon size={20} color={colors.onSurfaceLight} />
								<StyledText
									variant="label"
									size="sm"
									weight="boldItalic"
									color="onSurfaceLight"
									uppercase
								>
									Remover
								</StyledText>
							</View>
						</Pressable>
					</View>
				</View>
			)}

			<BottomSheet
				isPresented={sheetVisible}
				onDismiss={() => setSheetVisible(false)}
				title="Elegir evidencia"
			>
				<Button
					variant="primary"
					onPress={pickFromLibrary}
					style={{ alignSelf: "stretch" }}
				>
					<Button.Icon>
						<SheetIcon icon={PhotoIcon} />
					</Button.Icon>
					<Button.Text>Galería</Button.Text>
				</Button>
				<Button
					variant="secondary"
					onPress={pickFromCamera}
					style={{ alignSelf: "stretch" }}
				>
					<Button.Icon>
						<SheetIcon icon={CameraIcon} />
					</Button.Icon>
					<Button.Text>Cámara</Button.Text>
				</Button>
			</BottomSheet>
		</View>
	);
}
