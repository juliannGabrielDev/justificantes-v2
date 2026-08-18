import React, { createContext, forwardRef, useContext, useState } from "react";
import {
	Pressable,
	StyleSheet,
	TextInput,
	View,
	type StyleProp,
	type TextInputProps,
	type ViewStyle,
} from "react-native";
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
} from "react-native-reanimated";

import { StyledText } from "@/components/common/styled-text";
import {
	brand,
	fontSizes,
	fonts,
	radius,
	spacing,
	useStyles,
	useThemeColors,
	type ThemeColors,
} from "@/use-theme";

// Internal context
interface InputContextType {
	isFocused: boolean;
	setIsFocused: (focused: boolean) => void;
	hasError: boolean;
	colors: ThemeColors;
}

const InputContext = createContext<InputContextType | undefined>(undefined);

function useInputContext() {
	const context = useContext(InputContext);
	if (!context)
		throw new Error("Input sub-components must be inside <Input />");
	return context;
}

function createStyles(c: ThemeColors) {
	return StyleSheet.create({
		root: {
			width: "100%",
			flexDirection: "column",
			gap: spacing.xs,
		},
		field: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing.sm,
			minHeight: 48,
			paddingVertical: spacing.md,
			paddingHorizontal: spacing.xl,
			borderRadius: radius["3xl"],
			borderWidth: 2,
			borderColor: c.outline,
			backgroundColor: c.surfaceContainer,
		},
		fieldFocused: {
			backgroundColor: c.surfaceFieldFocus,
		},
		fieldError: {
			borderColor: brand.danger,
		},
		fieldText: {
			flex: 1,
			paddingVertical: 0,
			color: c.onSurface,
			fontFamily: fonts.medium,
			fontSize: fontSizes.body.md.fontSize,
			lineHeight: fontSizes.body.md.lineHeight,
		},
	});
}

/*
 * Compound form component: Input with sub-components for label, field,
 * icon and error/disclaimer message.
 *
 * Usage:
 * <Input>
 *   <Input.Label required>Nombre</Input.Label>
 *   <Input.Container>
 *     <Input.Icon icon={IdentificationIcon} />
 *     <Input.Field placeholder="Ingresa tu nombre" />
 *     <Input.Icon icon={EyeIcon} onPress={togglePassword} />
 *   </Input.Container>
 *   <Input.Error>Este campo es obligatorio</Input.Error>
 * </Input>
 */
function InputRoot({
	children,
	style,
	className,
	hasError = false,
}: {
	children: React.ReactNode;
	style?: ViewStyle;
	className?: string;
	hasError?: boolean;
}) {
	const [isFocused, setIsFocused] = useState(false);
	const { colors } = useThemeColors();
	const styles = useStyles(createStyles);

	return (
		<InputContext.Provider
			value={{ isFocused, setIsFocused, hasError, colors }}
		>
			<Animated.View
				layout={LinearTransition.springify()}
				style={[styles.root, style]}
				className={className}
			>
				{children}
			</Animated.View>
		</InputContext.Provider>
	);
}

// InputLabel ==================================================================
function InputLabel({
	children,
	className,
	required = false,
}: {
	children: React.ReactNode;
	className?: string;
	required?: boolean;
}) {
	return (
		<StyledText
			variant="body"
			size="md"
			weight="bold"
			color="onSurface"
			className={className}
		>
			{children}
			{required && <StyledText color={brand.danger}>*</StyledText>}
		</StyledText>
	);
}

// InputContainer ==============================================================
function InputContainer({
	children,
	className,
	style,
}: {
	children: React.ReactNode;
	className?: string;
	style?: StyleProp<ViewStyle>;
}) {
	const { isFocused, hasError } = useInputContext();
	const styles = useStyles(createStyles);

	return (
		<View
			style={[
				styles.field,
				isFocused && styles.fieldFocused,
				hasError && styles.fieldError,
				style,
			]}
			className={`shadow-brutalist-sm${className ? ` ${className}` : ""}`}
		>
			{children}
		</View>
	);
}

// InputField ==================================================================
const InputField = forwardRef<
	TextInput,
	TextInputProps & { className?: string }
>(({ className, style, onFocus, onBlur, multiline, ...props }, ref) => {
	const { setIsFocused } = useInputContext();
	const styles = useStyles(createStyles);

	return (
		<TextInput
			ref={ref}
			multiline={multiline}
			style={[
				styles.fieldText,
				multiline && { textAlignVertical: "top" },
				style,
			]}
			className={className}
			placeholderTextColor={styles.fieldText.color}
			onFocus={(e) => {
				setIsFocused(true);
				onFocus?.(e);
			}}
			onBlur={(e) => {
				setIsFocused(false);
				onBlur?.(e);
			}}
			{...props}
		/>
	);
});

InputField.displayName = "InputField";

// InputIcon ===================================================================
function InputIcon({
	icon: IconComponent,
	size = 24,
	onPress,
	className,
}: {
	icon: React.ComponentType<{ size?: number; color?: string }>;
	size?: number;
	onPress?: () => void;
	className?: string;
}) {
	const { colors } = useInputContext();

	if (onPress) {
		return (
			<Pressable onPress={onPress} className={className} hitSlop={8}>
				<IconComponent size={size} color={colors.onSurface} />
			</Pressable>
		);
	}

	return (
		<View className={className}>
			<IconComponent size={size} color={colors.onSurface} />
		</View>
	);
}

// InputError ==================================================================
function InputError({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	if (!children) return null;
	return (
		<StyledText
			variant="label"
			size="md"
			color={brand.danger}
			weight="medium"
			entering={FadeIn}
			exiting={FadeOut}
			className={className}
			testID="input-error"
		>
			{children}
		</StyledText>
	);
}

// InputDisclaimer =============================================================
function InputDisclaimer({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	if (!children) return null;
	return (
		<StyledText
			variant="label"
			size="md"
			color="onSurfaceVariant"
			weight="medium"
			entering={FadeIn}
			exiting={FadeOut}
			className={className}
			testID="input-disclaimer"
		>
			{children}
		</StyledText>
	);
}

export const Input = Object.assign(InputRoot, {
	Label: InputLabel,
	Container: InputContainer,
	Field: InputField,
	Icon: InputIcon,
	Error: InputError,
	Disclaimer: InputDisclaimer,
});
