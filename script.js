const API_KEY = "YourAPIKey"; 
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(content, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": API_KEY
        },
        body: JSON.stringify({
          contents: [
            // Fixed system prompt (always included first)
            {
              role: "user",
              parts: [
                { text: "You are a friendly chatbot that answers briefly and clearly." }
              ]
            },
            //  User’s actual input
            {
              role: "user",
              parts: [
                { text }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn’t get that.";
    addMessage(reply, "bot");
  } catch (err) {
    addMessage("Error: " + err.message, "bot");
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
