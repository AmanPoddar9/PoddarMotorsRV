'use client'

import { Suspense } from 'react'
import CreateReportForm from '../../../../components/admin/CreateReportForm'

export default function CreateReportPage() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <CreateReportForm />
    </Suspense>
  )
}
