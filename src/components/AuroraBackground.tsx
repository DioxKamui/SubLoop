// ============================================================================
// AuroraBackground.tsx — Fondo "aurora" con manchas de color
// ----------------------------------------------------------------------------
// Dibuja manchas suaves de color (violeta/cian/oro) detrás del contenido.
// Es lo que hace que el efecto "glass" de las tarjetas se vea vivo: el color
// translúcido de las superficies deja entrever estas manchas.
// ============================================================================
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';

export function AuroraBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>
          <RadialGradient id="aurora-violet" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.auroraViolet} stopOpacity="0.30" />
            <Stop offset="100%" stopColor={colors.auroraViolet} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="aurora-cyan" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.auroraCyan} stopOpacity="0.20" />
            <Stop offset="100%" stopColor={colors.auroraCyan} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="aurora-gold" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.18" />
            <Stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Circle cx="12" cy="16" r="44" fill="url(#aurora-violet)" />
        <Circle cx="88" cy="28" r="48" fill="url(#aurora-cyan)" />
        <Circle cx="50" cy="94" r="50" fill="url(#aurora-gold)" />
      </Svg>
    </View>
  );
}
