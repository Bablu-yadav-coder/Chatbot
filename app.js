const chatInput = document.querySelector("textarea");
const sendChatBtn = document.querySelector(".send");
const chatbox = document.querySelector(".chatbox");

// API setup. Here we are using AI API to response the user
const API_KEY = "AIzaSyBb4kJsSb4BWm9ZnSj-XvH__b1AKeuFqng";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// create a li element and append them into chatbox
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p> ${message}</p>` : `<p> ${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}


const generateResponse = async (incomingChatLi) => {
    // Create a paragraph element to add response in chatbox 
    const messageElement = incomingChatLi.querySelector("p");
    // request API setup for response 
    const requestOptions = {
        method : "POST",
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify({ 
            contents : [{
                parts : [{text : userMessage}]
            }]
        })
    };

    try { 
        // Fetch API and show response to user 
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);
        // add response in chatbox 
        messageElement.textContent = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        chatbox.scrollTo({top : chatbox.scrollHeight, behavior:"smooth"});
    } catch(error) {
        console.log(error);   // throw error if API call fail
    };
}

let userMessage;
const handleChat = () => {
    // chatInput contain user query 
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    // append user's messgae to chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));  // outgoing is class name of use textArea
    chatInput.value = "";
    // display response to the user
    setTimeout( ()=>{ 
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        // append response in the chatbox
        chatbox.appendChild(incomingChatLi); 
        generateResponse(incomingChatLi);
        chatbox.scrollTo({top : chatbox.scrollHeight, behavior:"smooth"});

    },400)

}
// Event handler on send icon 
sendChatBtn.addEventListener("click", handleChat)



