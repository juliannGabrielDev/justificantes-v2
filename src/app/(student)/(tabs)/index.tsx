import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
	AbsenceExcuseCard,
	type AbsenceExcuseCardProps,
} from "@/components/absence-excuse/absence-excuse-card";
import { Button } from "@/components/common/button";
import { StyledText } from "@/components/common/styled-text";
import { createScreenStyles } from "@/styles/screen.styles";
import { radius, spacing, useStyles } from "@/use-theme";

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

const GREETINGS = [
	"¡Hola!",
	"Hello!",
	"Bonjour!",
	"Ciao!",
	"Hallo!",
	"Olá!",
	"Konnichiwa!",
	"Namaste!",
	"Aloha!",
	"Hej!",
	"Salut!",
];

const createStyles = () =>
	StyleSheet.create({
		header: {
			alignSelf: "stretch",
		},
		statsGrid: {
			alignSelf: "stretch",
		},
		statsRow: {
			flexDirection: "row",
		},
	});

const Index = () => {
	const insets = useSafeAreaInsets();
	const styles = useStyles(createStyles);
	const screenStyles = useStyles(() => createScreenStyles(insets));
	const [greeting] = useState(
		() => GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
	);

	return (
		<ScrollView
			contentContainerStyle={screenStyles.screen}
			showsVerticalScrollIndicator={false}
		>
			<View style={styles.header}>
				<StyledText variant="display" size="lg" family="display" weight="black">
					{greeting}
				</StyledText>
				<StyledText
					variant="body"
					size="md"
					weight="bold"
					color="onSurfaceVariant"
				>
					Sistema de Justificantes CUCSur
				</StyledText>
			</View>

			<StyledText variant="title" size="md" weight="boldItalic">
				Tu Resumen
			</StyledText>
			<View style={styles.statsGrid}>
				<View style={styles.statsRow}>
					<View
						style={{
							flex: 1,
							backgroundColor: "#D9F99D",
							padding: spacing.lg,
							height: 120,
							borderTopLeftRadius: radius["4xl"],
							borderBottomLeftRadius: radius["4xl"],
						}}
					>
						<StyledText
							variant="display"
							size="md"
							family="display"
							weight="black"
							color="#365314"
						>
							5
						</StyledText>
						<StyledText
							variant="body"
							size="md"
							weight="boldItalic"
							color="#365314"
						>
							aprobados
						</StyledText>
					</View>
					<View
						style={{
							flex: 1,
							backgroundColor: "#A5F3FC",
							padding: spacing.lg,
							height: 120,
							borderTopLeftRadius: radius["4xl"],
							borderTopRightRadius: radius["4xl"],
						}}
					>
						<StyledText
							variant="display"
							size="md"
							family="display"
							weight="black"
							color="#164E63"
						>
							5
						</StyledText>
						<StyledText
							variant="body"
							size="md"
							weight="boldItalic"
							color="#164E63"
						>
							totales
						</StyledText>
					</View>
				</View>
				<View style={styles.statsRow}>
					<View
						style={{
							flex: 1,
							backgroundColor: "#FEF08A",
							padding: spacing.lg,
							height: 120,
							borderBottomLeftRadius: radius["4xl"],
							borderBottomRightRadius: radius["4xl"],
						}}
					>
						<StyledText
							variant="display"
							size="md"
							family="display"
							weight="black"
							color="#713F12"
						>
							2
						</StyledText>
						<StyledText
							variant="body"
							size="md"
							weight="boldItalic"
							color="#713F12"
						>
							pendientes
						</StyledText>
					</View>
					<View
						style={{
							flex: 1,
							backgroundColor: "#F5D0FE",
							padding: spacing.lg,
							height: 120,
							borderTopRightRadius: radius["4xl"],
							borderBottomRightRadius: radius["4xl"],
						}}
					>
						<StyledText
							variant="display"
							size="md"
							family="display"
							weight="black"
							color="#831843"
						>
							1
						</StyledText>
						<StyledText
							variant="body"
							size="md"
							weight="boldItalic"
							color="#831843"
						>
							rechazados
						</StyledText>
					</View>
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
