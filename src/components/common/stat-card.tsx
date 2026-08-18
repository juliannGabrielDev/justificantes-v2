import type { ComponentType } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import {
	CheckBadgeIcon,
	ClipboardDocumentListIcon,
	ClockIcon,
	XCircleIcon,
} from "react-native-heroicons/solid";

import { StyledText } from "@/components/common/styled-text";
import {
	brand,
	radius,
	spacing,
	useStyles,
	useThemeColors,
	type ThemeColors,
} from "@/use-theme";

export type StatCardVariant = "total" | "approved" | "pending" | "rejected";

export interface StatCardProps extends ViewProps {
	/** Big number rendered with the display font */
	value: string | number;
	/** Short label under the value (e.g. "en total.") */
	label: string;
	/** Semantic preset mapping icon + colors, defaults to 'total' */
	variant?: StatCardVariant;
	/** Override the preset icon */
	icon?: ComponentType<{ size: number; color: string }>;
	/** Override the preset icon circle background color */
	iconColor?: string;
	/** Override the preset icon tint color */
	iconContentColor?: string;
}

const ICON_SIZE = 24;

const STAT_CONFIG: Record<
	StatCardVariant,
	{
		icon: ComponentType<{ size: number; color: string }>;
		bg: string;
		contentColor: keyof ThemeColors;
	}
> = {
	total: {
		icon: ClipboardDocumentListIcon,
		bg: brand.primary,
		contentColor: "onSurfaceLight",
	},
	approved: {
		icon: CheckBadgeIcon,
		bg: brand.success,
		contentColor: "onSurfaceDark",
	},
	pending: {
		icon: ClockIcon,
		bg: brand.pending,
		contentColor: "onSurfaceLight",
	},
	rejected: {
		icon: XCircleIcon,
		bg: brand.danger,
		contentColor: "onSurfaceDark",
	},
};

const createStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: {
			backgroundColor: colors.surfaceContainer,
			borderRadius: radius["4xl"],
			padding: spacing.xl,
		},
		iconContainer: {
			padding: spacing.sm,
			alignSelf: "flex-start",
			alignItems: "center",
			justifyContent: "center",
			borderRadius: radius.full,
			borderWidth: 2,
			borderColor: colors.outline,
		},
	});

export function StatCard({
	value,
	label,
	variant = "total",
	icon,
	iconColor,
	iconContentColor,
	style,
	...rest
}: StatCardProps) {
	const styles = useStyles(createStyles);
	const { colors } = useThemeColors();

	const preset = STAT_CONFIG[variant];
	const Icon = icon ?? preset.icon;
	const bg = iconColor ?? preset.bg;
	const content = iconContentColor ?? colors[preset.contentColor];

	return (
		<View style={[styles.container, style]} {...rest} className="shadow-sm">
			<View
				style={[styles.iconContainer, { backgroundColor: bg }]}
				className="shadow-brutalist-sm"
			>
				<Icon size={ICON_SIZE} color={content} />
			</View>
			<StyledText
				variant="display"
				size="md"
				family="display"
				weight="black"
				color="onSurfaceVariant"
			>
				{value}
			</StyledText>
			<StyledText variant="body" size="md" weight="boldItalic">
				{label}
			</StyledText>
		</View>
	);
}
