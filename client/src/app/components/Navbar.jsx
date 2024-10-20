'use client'

import { useState } from 'react'
import { Drawer, Button } from 'antd'
import Link from 'next/link'
import { MenuOutlined } from '@ant-design/icons'
import { Space } from 'antd'

// logo
import Logo from '../../images/logo_text.png'
import Image from 'next/image'
import { IoMdClose } from 'react-icons/io'

const Navbar = () => {
  const [visible, setVisible] = useState(false)

  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

  const NavLink = ({ href, text }) => (
    <div className="h-full">
      <Link legacyBehavior href={href}>
        <a
          className="text-white text-md"
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            borderBottom: '3px solid transparent',
            paddingBottom: '15px',
            paddingTop: '15px',
            display: 'inline-block',
            transition: 'border-color 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'yellow'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'transparent'
          }}
        >
          {text}
        </a>
      </Link>
    </div>
  )

  return (
    <div className="bg-custom-black fixed top-0 z-50 py-4 md:pt-1 md:pb-0 w-[100vw]">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex items-center justify-evenly gap-x-60 lg:justify-between lg:gap-x-96 navbar-container lg:px-4 lg:pr-8">
          <div className="mx-auto lg:mx-0 pl-2">
            <Link href="/">
              <Image src={Logo} alt="logo" width={120} priority />
            </Link>
          </div>
          <div className="hidden md:flex justify-evenly items-center space-x-4 mx-auto lg:mx-0 flex-grow-1">
            <NavLink href="/buy" text="Buy" />
            <NavLink href="/sell" text="Sell" />
            <NavLink href="/finance" text="Finance" />
            <NavLink href="/contact" text="Contact Us" />
            <NavLink href="/about" text="About Us" />
            <NavLink href="/videos" text="Videos" />{' '}
            {/* Add this line for desktop */}
          </div>
          <div className="md:hidden m-auto">
            <Button
              className="bg-white"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
              }}
              icon={
                <MenuOutlined style={{ color: 'white', fontSize: '20px' }} />
              }
              onClick={showDrawer}
            />
          </div>
        </div>
      </div>
      <Drawer
        title={<span style={{ color: 'white' }}></span>}
        placement="right"
        closable={false}
        onClose={onClose}
        open={visible}
        className="!bg-custom-black text-white"
        style={{
          backgroundColor: '#111827',
          color: 'white',
          paddingTop: 10,
          paddingBottom: 10,
        }}
        extra={
          <Space>
            <IoMdClose
              color="white"
              size={25}
              onClick={onClose}
              style={{ alignSelf: 'center' }}
            />
          </Space>
        }
      >
        <div
          className="flex flex-col items-center mt-4 space-y-4"
          style={{ fontSize: '20px' }}
        >
          <Link legacyBehavior href="/">
            <a
              className="text-white font-bold focus:text-custom-yellow"
              onClick={onClose}
            >
              Home
            </a>
          </Link>
          <Link legacyBehavior href="/buy">
            <a
              className="text-white font-bold focus:text-custom-yellow"
              onClick={onClose}
            >
              Buy Car
            </a>
          </Link>
          <Link legacyBehavior href="/sell">
            <a
              className="text-white font-bold focus:text-custom-yellow"
              onClick={onClose}
            >
              Sell Car
            </a>
          </Link>
          <Link legacyBehavior href="/finance">
            <a
              className="text-white font-bold focus:text-custom-yellow"
              onClick={onClose}
            >
              Finance
            </a>
          </Link>
          <Link legacyBehavior href="/about">
            <a
              className="text-white font-bold focus:text-custom-yellow"
              onClick={onClose}
            >
              About Us
            </a>
          </Link>
          <Link legacyBehavior href="/contact">
            <a
              className="text-white font-bold focus:text-custom-yellow"
              onClick={onClose}
            >
              Contact Us
            </a>
          </Link>
          <Link legacyBehavior href="/videos">
            {' '}
            {/* Add this line for mobile */}
            <a
              className="text-white font-bold focus:text-custom-yellow"
              onClick={onClose}
            >
              Videos
            </a>
          </Link>
        </div>
      </Drawer>
    </div>
  )
}

export default Navbar
