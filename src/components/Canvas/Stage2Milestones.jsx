import React from 'react';
import {
  SageAiAgentProp,
  ApptioMicroservicesProp,
  JPMorganBankingVaultProp,
  OlaIotIngestionProp,
  FicoKafkaPipelineProp,
  MetabyteInsuranceEngineProp,
  JPMorganRiskShieldProp,
  SatyamWaferAutomationProp
} from './EraProps';

export const MILESTONE_POSITIONS = [
  { id: 'sage', y: -10, propSide: 'left', propPos: [-2.9, -10, 0.3], color: '#00f0ff' },
  { id: 'apptio', y: -17, propSide: 'right', propPos: [2.9, -17, 0.3], color: '#38bdf8' },
  { id: 'jpmorgan-sr', y: -24, propSide: 'left', propPos: [-2.9, -24, 0.3], color: '#10b981' },
  { id: 'ola', y: -31, propSide: 'right', propPos: [2.9, -31, 0.3], color: '#f59e0b' },
  { id: 'fico', y: -38, propSide: 'left', propPos: [-2.9, -38, 0.3], color: '#a855f7' },
  { id: 'metabyte', y: -45, propSide: 'right', propPos: [2.9, -45, 0.3], color: '#ec4899' },
  { id: 'jpmorgan-bpm', y: -52, propSide: 'left', propPos: [-2.9, -52, 0.3], color: '#06b6d4' },
  { id: 'satyam', y: -59, propSide: 'right', propPos: [2.9, -59, 0.3], color: '#14b8a6' }
];

export default function Stage2Milestones() {
  return (
    <group>
      {MILESTONE_POSITIONS.map((m) => {
        return (
          <group key={m.id}>
            {/* Era Specific Procedural 3D Spacecraft */}
            {m.id === 'sage' && <SageAiAgentProp position={m.propPos} />}
            {m.id === 'apptio' && <ApptioMicroservicesProp position={m.propPos} />}
            {m.id === 'jpmorgan-sr' && <JPMorganBankingVaultProp position={m.propPos} />}
            {m.id === 'ola' && <OlaIotIngestionProp position={m.propPos} />}
            {m.id === 'fico' && <FicoKafkaPipelineProp position={m.propPos} />}
            {m.id === 'metabyte' && <MetabyteInsuranceEngineProp position={m.propPos} />}
            {m.id === 'jpmorgan-bpm' && <JPMorganRiskShieldProp position={m.propPos} />}
            {m.id === 'satyam' && <SatyamWaferAutomationProp position={m.propPos} />}
          </group>
        );
      })}
    </group>
  );
}
