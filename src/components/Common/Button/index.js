import React from 'react'
import "./styles.css"

function Button({text,onClick,disabled}) {
  return (
    <div onClick={disabled?null:onClick} className='custom-btn'>
      {text}
    </div>
  )
}

export default Button;
