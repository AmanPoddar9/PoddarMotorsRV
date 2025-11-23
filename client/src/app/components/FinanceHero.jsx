import React from 'react'
// import { TypewriterEffectSmooth } from './ui/typewriter-effect'
import Image from 'next/image'
import finance from '../../images/finance.png'
import { TypewriterEffectSmooth } from './ui/typewriter-effect'

const FinanceHero = () => {
  return (
    <section className="bg-custom-black">
      <div className="flex flex-col lg:flex-row max-w-screen-xl px-4 py-12 mx-auto lg:gap-8 lg:py-16 lg:px-6">
        <div className="mr-auto place-self-center lg:col-span-7">
          <TypewriterEffectSmooth
            words={'Quick and Easy Car Loans'.split(' ').map((word) => {
              return {
                text: word,
                className:
                  'mb-2 text-3xl font-extrabold tracking-tight leading-none md:text-5xl text-white',
              }
            })}
          />
          <h1 className="max-w-2xl mb-4 text-2xl lg:text-4xl font-normal tracking-tight leading-10 text-gray-400">
            Low-cost and hassle-free
          </h1>
        </div>
        <div className="mt-10 lg:mt-0 lg:col-span-5">
          <Image src={finance} alt="Hero car image" priority width={500} />
        </div>
      </div>
    </section>
  )
}

export default FinanceHero
