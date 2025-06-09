'use client'
import React from 'react'
import { Oval } from 'react-loader-spinner'

const loading = () => {
  return (
    <div className="flex items-center justify-center p-2 h-[100vh]">
      {/* Style this loading in the center of screen */}
      <Oval color="#fded03" height={50} width={50} secondaryColor="#b45309" />
    </div>
  )
}

export default loading
