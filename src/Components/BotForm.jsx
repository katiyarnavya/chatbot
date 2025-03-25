import React, { useRef } from 'react'

const BotForm = () => {
    const inputRef = useRef();
    const handleSubmit = (e)=>{
        e.preventDefault();

    }
  return (
    <div>
      <form action="#" className='chat-form'>
            <input ref = {inputRef} type="text" placeholder='Message' className='msg-input' required/>
            <button class="material-symbols-rounded">keyboard_arrow_down</button>
        </form>
    </div>
  )
}

export default BotForm
