import React from 'react'
import EMICalculator from '../components/EMICalculator'
import Brands from '../components/Brands'
import FinanceSteps from '../components/FinanceSteps'
import { financeFAQs } from '../data/financeFAQs'
import Faq from '../components/Faq'
import FinanceHero from '../components/FinanceHero'

export default function FinancePage() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <FinanceHero />
      <EMICalculator />
      <Brands />
      <FinanceSteps />
      <Faq FAQs={financeFAQs} title="Finance related" />
    </div>
  )
}
