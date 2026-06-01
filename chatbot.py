import json
import os
import random
import urllib.request
import urllib.error
from typing import Dict, List, Optional

try:
    import openai
except ImportError:
    openai = None

RESPONSE_DB = [
    {
    "keywords": [
        "contato", "telefone", "numero", "número", "whatsapp",
        "zap", "falar", "conversar", "atendente", "atendimento",
        "humano", "responsável", "vendedor"
    ],
    "responses": [
        "Você pode falar diretamente com nossa equipe pelo WhatsApp: (85) 99949-2843. Teremos prazer em entender seu projeto e tirar suas dúvidas.",
        "Quer um atendimento mais rápido? Entre em contato pelo WhatsApp: (85) 99949-2843.",
        "Para orçamentos, dúvidas ou reuniões, entre em contato conosco pelo WhatsApp: (85) 99949-2843."
    ],
},
{
    "keywords": [
        "orçamento", "orcamento", "preço", "preco", "valor",
        "custo", "quanto custa", "investimento", "quanto fica",
        "cotação", "cotacao"
    ],
    "responses": [
        "O valor depende do tipo de projeto, funcionalidades e prazo. Podemos montar um orçamento personalizado para sua necessidade.",
        "Cada projeto é único. Conte um pouco sobre sua ideia para que possamos estimar prazo e investimento.",
        "Trabalhamos com landing pages, sites institucionais e sistemas personalizados. Qual solução você procura?"
    ],
},
{
    "keywords": [
        "site", "landing page", "landing", "pagina", "página",
        "website", "institucional", "empresa", "negócio"
    ],
    "responses": [
        "Desenvolvemos sites modernos, rápidos e responsivos, focados em transmitir credibilidade e gerar resultados para o seu negócio.",
        "Podemos criar desde landing pages para captação de clientes até sites institucionais completos para sua empresa.",
        "Um site profissional aumenta a confiança dos clientes e fortalece sua presença digital. Gostaria de saber mais?"
    ],
},
{
    "keywords": [
        "automação", "automacao", "automatizar", "integração",
        "integracao", "processo", "workflow", "ia",
        "inteligencia artificial", "chatbot"
    ],
    "responses": [
        "Criamos automações que economizam tempo e reduzem tarefas manuais utilizando integrações e inteligência artificial.",
        "Podemos automatizar atendimentos, captação de leads, envio de mensagens, relatórios e diversos outros processos.",
        "A automação ajuda empresas a ganharem produtividade e escalabilidade. O que você gostaria de automatizar?"
    ],
},
{
    "keywords": [
        "portfolio", "portfólio", "projetos", "trabalhos",
        "cases", "exemplos", "clientes"
    ],
    "responses": [
        "Temos experiência no desenvolvimento de sites, landing pages, automações e soluções personalizadas para diferentes segmentos.",
        "Podemos apresentar exemplos de projetos e soluções semelhantes ao que você procura.",
        "Cada projeto é desenvolvido de acordo com as necessidades do cliente e os objetivos do negócio."
    ],
},
{
    "keywords": [
        "prazo", "tempo", "demora", "entrega",
        "quando", "urgente", "rápido"
    ],
    "responses": [
        "O prazo varia conforme a complexidade do projeto, mas buscamos sempre entregar com rapidez e qualidade.",
        "Landing pages geralmente possuem um prazo menor, enquanto sistemas personalizados exigem uma análise mais detalhada.",
        "Informe o tipo de projeto desejado e poderemos fornecer uma estimativa de prazo."
    ],
},
{
    "keywords": [
        "empresa", "noven", "noven labs",
        "quem são", "quem sao", "sobre", "vocês", "voces"
    ],
    "responses": [
        "A Noven Labs é uma empresa especializada em desenvolvimento web, landing pages, sistemas personalizados, automações e soluções digitais.",
        "Nosso objetivo é ajudar empresas e profissionais a crescerem através da tecnologia e de uma presença digital profissional.",
        "Trabalhamos com foco em qualidade, agilidade e soluções modernas para negócios de todos os portes."
    ],
}
]

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_AVAILABLE = openai is not None and OPENAI_API_KEY is not None

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-mini")
GEMINI_API_URL = os.getenv(
    "GEMINI_API_URL",
    f"https://gemini.googleapis.com/v1/models/{GEMINI_MODEL}:generateText"
)
GEMINI_AVAILABLE = GEMINI_API_KEY is not None


def get_local_response(prompt: str) -> str:
    prompt_lower = prompt.lower()
    for item in RESPONSE_DB:
        if any(keyword in prompt_lower for keyword in item["keywords"]):
            return random.choice(item["responses"])

    fallback = [
        "Interessante. Pode me contar mais detalhes?",
        "Entendi, me fale um pouco mais sobre isso.",
        "Ótimo. O que você gostaria de fazer em seguida?",
        "Estou aqui para ajudar. Pode me explicar melhor o seu projeto?",
    ]
    return random.choice(fallback)


def get_openai_client() -> Optional[object]:
    if not OPENAI_AVAILABLE:
        return None

    if hasattr(openai, "OpenAI"):
        return openai.OpenAI(api_key=OPENAI_API_KEY)

    openai.api_key = OPENAI_API_KEY
    return openai


def get_openai_response(prompt: str, history: List[Dict[str, str]]) -> Optional[str]:
    client = get_openai_client()
    if client is None:
        return None

    messages = [
        {"role": "system", "content": "Você é um assistente virtual útil para apresentar a Noven Labs, explicar serviços de desenvolvimento e responder dúvidas de clientes."},
    ]
    messages.extend(history)
    messages.append({"role": "user", "content": prompt})

    try:
        if hasattr(client, "chat"):
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.8,
                max_tokens=250,
            )
            return response.choices[0].message.content.strip()

        completion = client.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.8,
            max_tokens=250,
        )
        return completion.choices[0].message.content.strip()
    except Exception as error:
        print(f"[Aviso] erro na API do OpenAI: {error}")
        return None


def get_gemini_response(prompt: str, history: List[Dict[str, str]]) -> Optional[str]:
    if not GEMINI_AVAILABLE:
        return None

    request_body = {
        "prompt": {"text": prompt},
        "temperature": 0.8,
        "maxOutputTokens": 250,
    }

    url = GEMINI_API_URL
    if "?" not in url:
        url = f"{url}?key={GEMINI_API_KEY}"

    request_data = json.dumps(request_body).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=request_data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            response_data = json.load(response)
            candidate = response_data.get("candidates", [])
            if candidate and isinstance(candidate, list):
                return candidate[0].get("content", "").strip()
            if "output" in response_data and "text" in response_data["output"]:
                return response_data["output"]["text"].strip()
            return None
    except urllib.error.HTTPError as http_err:
        error_body = http_err.read().decode("utf-8", errors="ignore")
        print(f"[Aviso] erro Gemini HTTP: {http_err.code} {error_body}")
        return None
    except Exception as error:
        print(f"[Aviso] erro na API do Gemini: {error}")
        return None


def get_response(prompt: str, history: List[Dict[str, str]]) -> str:
    if GEMINI_AVAILABLE:
        gemini_response = get_gemini_response(prompt, history)
        if gemini_response:
            return gemini_response

    if OPENAI_AVAILABLE:
        ai_response = get_openai_response(prompt, history)
        if ai_response:
            return ai_response

    return get_local_response(prompt)


def main() -> None:
    print("Noven Labs AI Chat")
    print("Digite 'sair' para encerrar a conversa.")
    if not OPENAI_AVAILABLE:
        print("[Aviso] OpenAI não está disponível. Usando respostas locais de fallback.")

    history: List[Dict[str, str]] = []

    while True:
        user_input = input("Você: ").strip()
        if not user_input:
            continue

        if user_input.lower() in {"sair", "exit", "quit"}:
            print("IA: Até logo! Foi um prazer ajudar.")
            break

        response = get_response(user_input, history)
        print(f"IA: {response}")

        history.append({"role": "user", "content": user_input})
        history.append({"role": "assistant", "content": response})


if __name__ == "__main__":
    main()
