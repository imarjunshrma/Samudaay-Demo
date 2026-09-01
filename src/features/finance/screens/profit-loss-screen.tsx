import React from 'react';
import { ProfitLossScreenContent as ProfitLossScreenContentView } from '../components/profit-loss-screen-content';

type ProfitLossScreenProps = Parameters<typeof ProfitLossScreenContentView>[0];

export function ProfitLossScreen(props: ProfitLossScreenProps) {
  return <ProfitLossScreenContentView {...(props ?? {})} />;
}

export default ProfitLossScreen;
