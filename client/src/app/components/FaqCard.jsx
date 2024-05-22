import { useState } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'

export default function FaqCard({
  question,
  answer,
  index,
  setShowIndex,
  showIndex,
}) {
  // const [show, setShow] = useState(false)
  const iconStyles = {
    fontSize: '1.5rem',
    transform: 'translaye(0.2rem, 1.5rem)',
  }
  const handleClick = () => {
    if (showIndex == index) {
      setShowIndex(null)
    } else {
      setShowIndex(index)
    }
  }
  return (
    <div
      className="bg-custom-black border-b border-custom-platinum  shadow-lg block my-4 !text-custom-seasalt"
      onClick={() => handleClick()}
    >
      <div className="py-4 px-6 cursor-pointer">
        <div className="w-[95%] inline-block">{question}</div>
        <div className="w-[5%] text-right inline-block">
          {showIndex == index ? (
            <FaAngleUp style={iconStyles} />
          ) : (
            <FaAngleDown style={iconStyles} />
          )}
        </div>
      </div>
      {index == showIndex && (
        <div className="faq-answer pb-4 px-6">{answer}</div>
      )}
    </div>
  )
}
