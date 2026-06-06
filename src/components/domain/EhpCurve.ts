export interface EhpCurvePoint {
  resistance: number; // 0 to 1
  ehp: number;
}

export const generateEhpCurve = (
  baseHealth: number,
  maxResistance: number = 0.9,
  steps: number = 20,
  incomingDamage?: number
): EhpCurvePoint[] => {
  const curve: EhpCurvePoint[] = [];
  const stepSize = maxResistance / steps;
  
  for (let i = 0; i <= steps; i++) {
    const res = i * stepSize;
    // Prevent division by zero if res hits 1.0
    const safeRes = Math.min(res, 0.999);
    
    // Using Deadlock's floor formula from math.ts if incomingDamage is provided
    let ehp = baseHealth / (1 - safeRes);
    if (incomingDamage !== undefined && incomingDamage > 0) {
      const remainingDamage = incomingDamage * (1 - safeRes);
      // Floor remaining damage at 1
      const actualDamage = Math.max(1, remainingDamage);
      // EHP = Hits to die * incomingDamage
      // Hits to die = baseHealth / actualDamage
      ehp = (baseHealth / actualDamage) * incomingDamage;
    }
    
    curve.push({ resistance: safeRes, ehp });
  }
  
  return curve;
};
