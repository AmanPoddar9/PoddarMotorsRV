 import React from 'react'

// finance brands
import poona from '../../images/finance_logos/poona.png'
import chola from '../../images/finance_logos/chola.png'
import hdb from '../../images/finance_logos/hdb.png'
import hdfc from '../../images/finance_logos/hdfc.png'
import hero from '../../images/finance_logos/hero.png'
import icici from '../../images/finance_logos/icici.png'
import induslnd from '../../images/finance_logos/induslnd.png'
import mahindra from '../../images/finance_logos/mahindra.png'
import shriram from '../../images/finance_logos/shriram.png'
import Image from 'next/image'

const Brands = () => {
  return (
    <section className="bg-white">
      <div className="py-8 lg:py-16 mx-auto max-w-screen-xl px-6">
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight leading-tight text-gray-900 md:text-4xl">
          Our Finance Partners
        </h2>
        <h3 className="mb-6 lg:mb-6 text-xl tracking-tight leading-tight text-gray-500 md:text-2xl">
          Backed by the best,
        </h3>
        <div className="grid grid-cols-2 gap-8 sm:gap-12 md:grid-cols-3 lg:grid-cols-6 text-gray-400">
          <div className="flex justify-center items-center hover:shadow-xl rounded-lg p-4">
            <Image src={poona} alt="Poona" width={250} height={250} />
          </div>
          <div className="flex justify-center items-center hover:shadow-xl rounded-lg p-4">
            <Image src={chola} alt="Chola" width={250} height={250} />
          </div>
          <div className="flex justify-center items-center hover:shadow-xl rounded-lg p-4">
            <Image src={hdb} alt="HDB" width={250} height={250} />
          </div>
          <div className="flex justify-center items-center hover:shadow-xl rounded-lg p-4">
            <Image src={hdfc} alt="HDFC" width={250} height={250} />
          </div>
          <div className="flex justify-center items-center hover:shadow-xl rounded-lg p-4">
            <Image src={hero} alt="Hero" width={250} height={250} />
          </div>
          <div className="flex justify-center items-center hover:shadow-xl rounded-lg p-4">
            <Image src={icici} alt="ICICI" width={250} height={250} />
          </div>
          <div className="flex justify-center items-center hover:shadow-xl rounded-lg p-4">
            <Image src={induslnd} alt="Induslnd" width={250} height={250} />
          </div>
          <div className="flex justify-center items-center hover:shadow-xl rounded-lg p-4">
            <Image src={mahindra} alt="Mahindra" width={250} height={250} />
          </div>
          <div className="flex justify-center items-center hover:shadow-xl rounded-lg p-4">
            <Image src={shriram} alt="Shriram" width={250} height={250} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Brands
