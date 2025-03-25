

import './App.css'
import ChatbotIcon from './Components/ChatbotIcon'
import BotForm from './Components/BotForm'

function App() {
  return (
    <>
      <div className="container">
          <div className="chatbot-popup">
                <div className="chat-header">
                  <div className="header-info">
                    <ChatbotIcon/>
                    <h2 className='logo-txt'>Aurobot</h2>
                  </div>
                  <button class="material-symbols-rounded">keyboard_arrow_down</button>
                </div>
                <div className="chatbody">
                  <div className=" msg bot-msg">
                    <ChatbotIcon/>
                    <p className="msg-text">
                      Hey there👋 <br /> How can I help you today?
                    </p>
                  </div>
                  <div className="msg user-msg">
                    <p className="msg-text">
                      Hey! Please tell me ..... 
                    </p>
                  </div>
                </div>
                <div className="bot-footer">
                  <BotForm/>
                </div>
          </div>
      </div>
    </>
  )
}
export default App
