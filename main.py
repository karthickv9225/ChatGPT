from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

load_dotenv(override=True)

llm = ChatGroq(
    model="openai/gpt-oss-20b",
    api_key=os.getenv("GROQ_API_KEY")
)

while True:
    user_message = input("\nYou: ")

    if user_message.lower() == "exit":
        print("Chat ended.")
        break

    response = llm.invoke(user_message)

    print("AI:", response.content)