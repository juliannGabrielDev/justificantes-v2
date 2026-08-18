import DateTimePicker from "@expo/ui/community/datetime-picker";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import {
	Modal,
	Platform,
	Pressable,
	StyleSheet,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import { CalendarDaysIcon } from "react-native-heroicons/solid";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { Button } from "@/components/common/button";
import { StyledText } from "@/components/common/styled-text";
import { useHaptics } from "@/hooks/use-haptics";
import {
	brand,
	radius,
	spacing,
	useStyles,
	useThemeColors,
	type ThemeColors,
} from "@/use-theme";

export type DatePickerVariant = "primary" | "secondary" | "tertiary";

export interface DatePickerProps {
	label: string;
	value: Date;
	onChange: (date: Date) => void;
	variant?: DatePickerVariant;
	disabled?: boolean;
	required?: boolean;
	maximumDate?: Date;
	minimumDate?: Date;
	className?: string;
	style?: StyleProp<ViewStyle>;
}

const VARIANT_BADGE: Record<DatePickerVariant, string> = {
	primary: brand.primary,
	secondary: brand.secondary,
	tertiary: brand.tertiary,
};

function normalizePickerDate(date: Date): Date {
	const offset = date.getTimezoneOffset();
	if (offset > 0) {
		return new Date(
			date.getUTCFullYear(),
			date.getUTCMonth(),
			date.getUTCDate(),
			12,
			0,
			0,
			0,
		);
	}
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		12,
		0,
		0,
		0,
	);
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
		},
		valueText: {
			flex: 1,
			paddingTop: spacing.md,
			paddingBottom: spacing.md,
			paddingLeft: spacing.sm,
			paddingRight: spacing.md,
		},
		scrim: {
			flex: 1,
			justifyContent: "flex-end",
		},
		sheet: {
			backgroundColor: c.surfaceContainer,
			borderTopWidth: 2,
			borderColor: c.outline,
			borderTopLeftRadius: radius["4xl"],
			borderTopRightRadius: radius["4xl"],
			padding: spacing.xl,
			paddingBottom: 32,
			gap: spacing["2xl"],
		},
		headerRow: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
		pickerWrap: {
			alignItems: "center",
			justifyContent: "center",
			padding: spacing.md,
			borderRadius: radius.xl,
		},
	});
}

export default function DatePicker({
	label,
	value,
	onChange,
	variant = "secondary",
	disabled = false,
	required = false,
	maximumDate,
	minimumDate,
	className,
	style,
}: DatePickerProps) {
	const [show, setShow] = useState(false);
	const [tempDate, setTempDate] = useState(value);
	const styles = useStyles(createStyles);
	const { colors, isDark } = useThemeColors();
	const haptics = useHaptics();
	const offset = useSharedValue(0);

	useEffect(() => {
		setTempDate(value);
	}, [value]);

	const surfaceStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: offset.get() - 2 }],
	}));

	const open = () => {
		haptics.light();
		setShow(true);
	};

	const close = () => {
		haptics.light();
		setShow(false);
	};

	const confirm = () => {
		haptics.light();
		onChange(tempDate);
		setShow(false);
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
			scheduleOnRN(open);
		});

	const displayDateStr = value.toLocaleDateString("es-MX", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

	const iconColor =
		variant === "secondary" ? colors.onSurfaceDark : colors.onSurfaceLight;

	return (
		<View style={[styles.root, style]} className={className}>
			<StyledText variant="body" size="md" weight="bold" color="onSurface">
				{label}
				{required && <StyledText color={brand.danger}>*</StyledText>}
			</StyledText>

			<GestureDetector gesture={tap}>
				<View>
					{/* Static shadow block behind the animated surface */}
					<View style={styles.shadowBlock}>
						<Animated.View
							style={[styles.field, surfaceStyle, disabled && { opacity: 0.5 }]}
						>
							<View
								style={[
									styles.badge,
									{
										backgroundColor: VARIANT_BADGE[variant],
									},
								]}
							>
								<CalendarDaysIcon size={24} color={iconColor} />
							</View>
							<StyledText
								variant="body"
								size="md"
								weight="boldItalic"
								color="onSurfaceVariant"
								style={styles.valueText}
							>
								{displayDateStr}
							</StyledText>
						</Animated.View>
					</View>
				</View>
			</GestureDetector>

			{/* Android native dialog picker */}
			{show && Platform.OS === "android" && (
				<DateTimePicker
					value={value}
					mode="date"
					onValueChange={(event, date) => {
						setShow(false);
						haptics.light();
						onChange(normalizePickerDate(date));
					}}
					onDismiss={() => setShow(false)}
					maximumDate={maximumDate}
					minimumDate={minimumDate}
				/>
			)}

			{/* iOS bottom sheet picker */}
			{Platform.OS === "ios" && (
				<Modal
					transparent
					visible={show}
					animationType="fade"
					onRequestClose={close}
				>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<Pressable style={styles.scrim} onPress={close}>
							<BlurView
								intensity={30}
								tint={isDark ? "dark" : "light"}
								blurMethod="dimezisBlurViewSdk31Plus"
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
								}}
							/>
							<Pressable onPress={() => {}}>
								<View style={styles.sheet}>
									<View style={styles.headerRow}>
										<StyledText variant="title" size="md" weight="bold">
											{label}
										</StyledText>
										<Button variant="primary" onPress={confirm}>
											<Button.Text className="uppercase">Confirmar</Button.Text>
										</Button>
									</View>

									<View style={styles.pickerWrap}>
										<DateTimePicker
											value={tempDate}
											mode="date"
											display="spinner"
											onValueChange={(event, date) =>
												setTempDate(normalizePickerDate(date))
											}
											style={{ width: "100%" }}
											maximumDate={maximumDate}
											minimumDate={minimumDate}
											themeVariant={isDark ? "dark" : "light"}
											locale="es-MX"
										/>
									</View>
								</View>
							</Pressable>
						</Pressable>
					</GestureHandlerRootView>
				</Modal>
			)}
		</View>
	);
}
