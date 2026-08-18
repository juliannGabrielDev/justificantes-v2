import { StyleSheet, View, type ViewProps } from "react-native";

import {
	AbsenceExcuseBadge,
	type Fraction,
} from "@/components/absence-excuse/absence-excuse-badge";
import {
	StatusBadge,
	type StatusBadgeVariant,
} from "@/components/absence-excuse/status-badge";
import { StyledText } from "@/components/common/styled-text";
import { radius, spacing, useStyles, type ThemeColors } from "@/use-theme";

export interface AbsenceExcuseCardProps extends ViewProps {
	/** Status title (e.g. "Aprobado") */
	title: string;
	/** Excuse identifier (e.g. "#001") */
	code: string;
	/** User-written reason text */
	reason: string;
	/** Formatted absence date (e.g. "DD/MM/AAAA") */
	date: string;
	/** Formatted request date rendered after "Solicitado el" */
	requestedAt: string;
	status: StatusBadgeVariant;
	fraction: Fraction;
}

const createStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: {
			borderWidth: 2,
			borderColor: colors.outline,
			borderRadius: radius["4xl"],
			backgroundColor: colors.surfaceContainer,
			padding: spacing.xl,
			gap: spacing.sm,
		},
		headerRow: {
			flexDirection: "row",
			alignItems: "flex-start",
			justifyContent: "space-between",
		},
		headerLeft: {
			flexShrink: 1,
			gap: spacing.xs,
			paddingRight: spacing.sm,
		},
		badges: {
			flexDirection: "row",
			gap: spacing.xs,
		},
		reasonWrapper: {
			padding: spacing.md,
			backgroundColor: colors.surfaceContainerHigh,
			borderWidth: 1,
			borderColor: colors.outlineVariant,
			borderRadius: radius["2xl"],
			borderStyle: "dashed",
		},
		footer: {
			gap: spacing.xs,
		},
		dateRow: {
			flexDirection: "row",
			gap: spacing.xs,
		},
	});

export function AbsenceExcuseCard({
	title,
	code,
	reason,
	date,
	requestedAt,
	status,
	fraction,
	style,
	...rest
}: AbsenceExcuseCardProps) {
	const styles = useStyles(createStyles);

	return (
		<View
			style={[styles.container, style]}
			className="shadow-brutalist-sm"
			{...rest}
		>
			<View style={styles.headerRow}>
				<View style={styles.headerLeft}>
					<StyledText
						variant="title"
						size="lg"
						family="display"
						weight="bold"
						truncate
					>
						{title}
					</StyledText>
					<StyledText
						variant="label"
						size="sm"
						weight="boldItalic"
						color="onSurfaceVariant"
					>
						{code}
					</StyledText>
				</View>
				<View style={styles.badges}>
					<StatusBadge variant={status} />
					<AbsenceExcuseBadge fraction={fraction} />
				</View>
			</View>
			<View style={styles.reasonWrapper}>
				<StyledText variant="label" size="md" truncate={2}>
					{reason}
				</StyledText>
			</View>
			<View style={styles.footer}>
				<View style={styles.dateRow}>
					<StyledText variant="body" size="md" weight="boldItalic">
						Fecha:
					</StyledText>
					<StyledText variant="body" size="md" color="onSurfaceVariant">
						{date}
					</StyledText>
				</View>
				<StyledText variant="body" size="md" color="onSurfaceVariant">
					Solicitado el {requestedAt}
				</StyledText>
			</View>
		</View>
	);
}
