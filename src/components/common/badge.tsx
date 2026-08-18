import type { ComponentType } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { StyledText } from '@/components/common/styled-text';
import { radius, spacing, useStyles } from '@/use-theme';

export type BadgeIcon = ComponentType<{ size: number; color: string }>;

export interface BadgeProps extends ViewProps {
	/** Icon rendered inside the badge (e.g. heroicons solid) */
	icon: BadgeIcon;
	/** Badge background color */
	bg: string;
	/** Icon + label color */
	contentColor: string;
	/** Optional uppercase label after the icon */
	label?: string;
}

const BADGE_ICON_SIZE = 20;

const createStyles = () =>
	StyleSheet.create({
		container: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: spacing.xs,
			borderRadius: radius['2xl'],
			paddingVertical: spacing.xs,
			paddingHorizontal: spacing.sm,
		},
		withLabel: {
			paddingRight: spacing.md,
		},
	});

export function Badge({
	icon: Icon,
	bg,
	contentColor,
	label,
	style,
	...rest
}: BadgeProps) {
	const styles = useStyles(createStyles);

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: bg },
				label && styles.withLabel,
				style,
			]}
			{...rest}
		>
			<Icon size={BADGE_ICON_SIZE} color={contentColor} />
			{label && (
				<StyledText
					variant="label"
					size="sm"
					weight="bold"
					uppercase
					color={contentColor}
				>
					{label}
				</StyledText>
			)}
		</View>
	);
}
