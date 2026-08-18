import type { ViewProps } from 'react-native';
import {
	CheckBadgeIcon,
	ClockIcon,
	XCircleIcon,
} from 'react-native-heroicons/solid';

import { Badge, type BadgeIcon } from '@/components/common/badge';
import { brand, useThemeColors, type ThemeColors } from '@/use-theme';

export type StatusBadgeVariant = 'approved' | 'pending' | 'rejected';

export interface StatusBadgeProps extends ViewProps {
	variant: StatusBadgeVariant;
}

const STATUS_CONFIG: Record<
	StatusBadgeVariant,
	{ icon: BadgeIcon; bg: string; contentColor: keyof ThemeColors }
> = {
	approved: {
		icon: CheckBadgeIcon,
		bg: brand.success,
		contentColor: 'onSurfaceDark',
	},
	pending: {
		icon: ClockIcon,
		bg: brand.tertiary,
		contentColor: 'onSurfaceLight',
	},
	rejected: {
		icon: XCircleIcon,
		bg: brand.danger,
		contentColor: 'onSurfaceDark',
	},
};

export function StatusBadge({ variant, ...rest }: StatusBadgeProps) {
	const { colors } = useThemeColors();
	const config = STATUS_CONFIG[variant];

	return (
		<Badge
			icon={config.icon}
			bg={config.bg}
			contentColor={colors[config.contentColor]}
			{...rest}
		/>
	);
}
