// ============================================================================
// useCountUp.ts — Anima un número de 0 hasta su valor objetivo
// ----------------------------------------------------------------------------
// Se usa para que las cifras de ahorro "cuenten" hacia arriba al aparecer.
// Devuelve el número animado; el componente decide cómo formatearlo.
// ============================================================================
import { useEffect, useState } from 'react';
import { Animated } from 'react-native';

export function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0);
  // useState con inicializador: crea el Animated.Value una sola vez (estable).
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    // Escuchamos el avance (0 → 1) y lo convertimos a un entero.
    const id = progress.addListener(({ value: v }) => {
      setValue(Math.round(target * v));
    });

    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration,
      useNativeDriver: false, // necesario: leemos el valor en JS
    }).start();

    return () => progress.removeListener(id);
  }, [target, duration, progress]);

  return value;
}
