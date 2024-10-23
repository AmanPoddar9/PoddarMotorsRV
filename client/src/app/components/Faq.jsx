'use client'
import React, { useState } from 'react'
import FaqCard from './FaqCard'

const Faq = ({ FAQs, title }) => {
  const [showIndex, setShowIndex] = useState(null)

  return (
    <section id="faqhome" className="py-14 bg-custom-black">
      <div className="px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="max-w-screen-md mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl lg:text-4xl tracking-tight font-extrabold text-custom-seasalt">
            {title} FAQ's
          </h2>
          <p className=" text-lg lg:text-xl text-custom-platinum">
            Please reach out to us if your queries are not answered below.
          </p>
        </div>
        <div className="text-left">
          {FAQs.map((item, index) => (
            <FaqCard
              key={item.id}
              question={item.question}
              answer={item.answer}
              index={index}
              showIndex={showIndex}
              setShowIndex={setShowIndex}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faq
