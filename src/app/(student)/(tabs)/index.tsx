import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
	AbsenceExcuseCard,
	type AbsenceExcuseCardProps,
} from "@/components/absence-excuse/absence-excuse-card";
import { Button } from "@/components/common/button";
import { StatCard } from "@/components/common/stat-card";
import { StyledText } from "@/components/common/styled-text";
import { createScreenStyles } from "@/styles/screen.styles";
import { spacing, useStyles } from "@/use-theme";

const RECENT_EXCUSES: AbsenceExcuseCardProps[] = [
	{
		title: "Aprobado",
		code: "#001",
		reason:
			"Presenté fiebre alta y el médico me recomendó reposo absoluto por 24 horas.",
		date: "14/08/2026",
		requestedAt: "15/08/2026",
		status: "approved",
		fraction: 1,
	},
	{
		title: "Pendiente",
		code: "#002",
		reason:
			"Tuve una emergencia familiar imprevista y tuve que ausentarme durante la jornada matutina.",
		date: "15/08/2026",
		requestedAt: "15/08/2026",
		status: "pending",
		fraction: 2,
	},
	{
		title: "Rechazado",
		code: "#003",
		reason:
			"Problemas mecánicos con mi vehículo personal en autopista que retrasaron mi llegada. Problemas mecánicos con mi vehículo personal en autopista que retrasaron mi llegada.",
		date: "16/08/2026",
		requestedAt: "16/08/2026",
		status: "rejected",
		fraction: 3,
	},
];

const createStyles = () =>
	StyleSheet.create({
		header: {
			alignSelf: "stretch",
		},
		statsGrid: {
			alignSelf: "stretch",
			gap: spacing.md,
		},
		statsRow: {
			flexDirection: "row",
			gap: spacing.md,
		},
	});

const Index = () => {
	const insets = useSafeAreaInsets();
	const styles = useStyles(createStyles);
	const screenStyles = useStyles(() => createScreenStyles(insets));

	return (
		<ScrollView
			contentContainerStyle={screenStyles.screen}
			showsVerticalScrollIndicator={false}
		>
			<View style={styles.header}>
				<StyledText variant="display" size="lg" family="display" weight="black">
					¡Hola!
				</StyledText>
				<StyledText
					variant="body"
					size="sm"
					weight="bold"
					color="onSurfaceVariant"
				>
					Gestiona tus justificantes con facilidad.
				</StyledText>
			</View>

			<StyledText variant="title" size="md" weight="boldItalic">
				Tu Resumen
			</StyledText>
			<View style={styles.statsGrid}>
				<View style={styles.statsRow}>
					<StatCard
						variant="rejected"
						value={1}
						label="rechazados."
						style={{ flex: 1 }}
					/>
					<StatCard
						variant="pending"
						value={6}
						label="pendientes."
						style={{ flex: 1 }}
					/>
				</View>
				<View style={styles.statsRow}>
					<StatCard
						variant="approved"
						value={3}
						label="aprobados."
						style={{ flex: 1 }}
					/>
					<StatCard
						variant="total"
						value={10}
						label="en total."
						style={{ flex: 1 }}
					/>
				</View>
			</View>

			<StyledText variant="title" size="md" weight="boldItalic">
				Actividad Reciente
			</StyledText>
			{RECENT_EXCUSES.map((excuse, index) => (
				<AbsenceExcuseCard key={index} {...excuse} />
			))}

			<Button variant="primary" style={{ alignSelf: "flex-end" }}>
				<Button.Text>Ver más</Button.Text>
			</Button>
		</ScrollView>
	);
};

export default Index;
