import type { ViewProps } from "react-native";
import {
	BriefcaseIcon,
	ExclamationTriangleIcon,
	HeartIcon,
} from "react-native-heroicons/solid";

import { Badge, type BadgeIcon } from "@/components/common/badge";
import { brand, useThemeColors, type ThemeColors } from "@/use-theme";

export type Fraction = 1 | 2 | 3;

export interface AbsenceExcuseBadgeProps extends ViewProps {
	fraction: Fraction;
}

const FRACTION_CONFIG: Record<
	Fraction,
	{
		icon: BadgeIcon;
		bg: string;
		contentColor: keyof ThemeColors;
		label: string;
	}
> = {
	1: {
		icon: HeartIcon,
		bg: brand.primary,
		contentColor: "onSurfaceLight",
		label: "I",
	},
	2: {
		icon: BriefcaseIcon,
		bg: brand.secondary,
		contentColor: "onSurfaceDark",
		label: "II",
	},
	3: {
		icon: ExclamationTriangleIcon,
		bg: brand.tertiary,
		contentColor: "onSurfaceLight",
		label: "III",
	},
};

export function AbsenceExcuseBadge({
	fraction,
	...rest
}: AbsenceExcuseBadgeProps) {
	const { colors } = useThemeColors();
	const config = FRACTION_CONFIG[fraction];

	return (
		<Badge
			icon={config.icon}
			bg={config.bg}
			contentColor={colors[config.contentColor]}
			label={config.label}
			{...rest}
		/>
	);
}
