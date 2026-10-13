# ResolveIQ

<p align="center">
  <img src="https://github.com/user-attachments/assets/d90c70e9-ea7b-4f52-b6ab-a3ac47d7f65e" alt="ResolveIQ Logo" width="140" />
</p>

<h3 align="center">AI-powered customer support with intelligent agents.</h3>

<p align="center">
  Building an AI agent that investigates customer issues, retrieves relevant knowledge, and assists with resolutions.
</p>

<p align="center">
  <a href="https://github.com/harshgitdeep/ResolveIQ">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository" />
  </a>
  <a href="https://www.linkedin.com/in/harshdeepsingh-/">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Profile" />
  </a>
</p>

---

## About

**ResolveIQ** is a hands-on project exploring how AI agents can improve customer support beyond simple chatbot responses.

Imagine a customer asking, *"Can I get a refund for the headphones I purchased last week?"*

Instead of generating a generic answer, ResolveIQ aims to build an AI agent that understands the question, checks relevant policies and order details, determines the appropriate next step, and guides the customer toward a resolution.

## Tech Stack

| Technology | Role in ResolveIQ |
|---|---|
| **React** | Powers the customer portal, where users ask questions, manage tickets, and follow conversations. |
| **Node.js + Express** *(planned)* | Handles API requests, connects the frontend to backend services, and coordinates the agent workflow. |
| **Google Gemini** *(planned)* | Interprets customer questions, reasons over available context, and helps determine which tools or information are needed. |
| **AI Agent** *(planned)* | Coordinates the support task, invokes approved tools, evaluates results, and determines the next step. |
| **MongoDB** *(planned)* | Stores customer records, orders, tickets, and conversation history. |
| **RAG + Vector Search** *(planned)* | Retrieves relevant support documentation, such as refund policies and product FAQs, to ground AI responses. |

## How It Works

**Example: A customer asks, "Can I get a refund for my headphones?"**

1. **Customer query:** The customer submits the question through the React interface.
2. **Backend processing:** Node.js and Express receive the request and pass it to the agent workflow.
3. **Intent understanding:** Gemini interprets the question and identifies the information needed to answer it.
4. **Knowledge retrieval:** The agent retrieves relevant refund policies through RAG and uses approved tools to look up the customer's order details.
5. **Decision support:** Gemini evaluates the retrieved context and order information to help determine the appropriate next step under the applicable rules.
6. **Resolution:** The agent explains the result or invokes an authorized tool, such as submitting a refund request, after the necessary validation and permission checks.

## How the AI Components Work Together

- **Gemini — The language model:** Understands queries, reasons over supplied information, and helps select the next step.
- **AI Agent — The orchestrator:** Coordinates the multi-step workflow, calls tools, processes results, and manages task execution.
- **RAG — The knowledge layer:** Retrieves relevant support documents instead of relying solely on the model's general knowledge.
- **Backend tools — The action layer:** Retrieve order details, check ticket status, and perform authorized operations.
- **MongoDB — The data layer:** Persists customer, order, ticket, and conversation information.

Gemini does not automatically know a customer's order history or the company's refund policies. The application must retrieve that information and provide the appropriate context and tools.

Refund eligibility and authorization will be enforced by backend rules rather than delegated solely to the language model.

## What I'm Exploring

- AI agents and multi-step reasoning
- Tool calling and controlled application actions
- Retrieval-Augmented Generation (RAG) and vector search
- Agent orchestration and reliable support workflows

---

<p align="center">
  Built by learning through experimentation.
</p>

<p align="center">
  <i>Note: The backend, Gemini integration, agent workflow, and RAG pipeline are planned components and are not yet implemented.</i>
</p>
