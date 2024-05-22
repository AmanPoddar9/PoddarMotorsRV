'use client'
import React, { useEffect, useState } from 'react'
import { DownOutlined, CarOutlined } from '@ant-design/icons'

import { Button, Dropdown, message, Space } from 'antd'

const ButtonCloud = ({ options, label }) => {
  const [currentItem, setCurrentItem] = useState('')
  const handleMenuClick = (e) => {
    if (label == 'Brand' && e.key == '7') {
      return
    }
    const obj = options.find((item) => item.key == e.key)
    if (label == 'Brand') {
      setCurrentItem(obj.label.props.children[2].trim())
    } else {
      setCurrentItem(obj.label)
    }
  }

  const budgetsMapping = {
    '<4 Lakh': '0-400000',
    '4-8 Lakh': '400000-800000',
    '>8 Lakh': '800000',
  }

  useEffect(() => {
    if (currentItem) {
      let tempObj = localStorage.getItem('filters')
      if (!tempObj) {
        tempObj = {}
      } else {
        tempObj = JSON.parse(tempObj)
      }

      if (label == 'Budget') {
        tempObj[label] = budgetsMapping[currentItem.trim()]
      } else {
        tempObj[label] = currentItem
      }
      localStorage.setItem('filters', JSON.stringify(tempObj))
    }
  }, [currentItem])
  const menuProps = { onClick: handleMenuClick, items: options }
  return (
    <Space wrap>
      <Dropdown menu={menuProps} trigger={['click']} placement="bottom">
        <Button
          size="large"
          className="focus:border-yellow-500  hover:text-custom-jet"
        >
          <div className="button-cloud hover:text-custom-jet">
            <div>{currentItem ? currentItem : label}</div>
            <DownOutlined />
          </div>
        </Button>
      </Dropdown>
    </Space>
  )
}

export default ButtonCloud
