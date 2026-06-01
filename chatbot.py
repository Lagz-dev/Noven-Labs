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
        "keywords": ["orçamento", "orcamento", "preço", "preco", "valor", "custo"],
        "responses": [
            "Para orçamento, eu posso te ajudar a definir escopo, prazo e tecnologias. Conte-me: qual tipo de site ou sistema você deseja?",
            "Posso montar uma proposta personalizada para você. Qual serviço você está pensando em contratar?",
            "Vamos conversar sobre prazo, investimento e funcionalidades. Me diga: será um site, sistema ou automação?",
        ],
    },
    {
        "keywords": ["site", "landing", "loja", "e-commerce", "página", "pagina"],
        "responses": [
            "Se você quer um site, posso sugerir um design responsivo e otimizado para conversão. Você prefere uma landing page, portfólio ou loja online?",
            "Criamos sites modernos com foco em experiência do usuário e desempenho. Precisa de um site institucional ou loja virtual?",
            "Um site bem construído ajuda a vender mais e gerar confiança. Quer que eu explique como funcionaria o processo?",
        ],
    },
    {
        "keywords": ["automaçã", "automação", "automacao", "workflow", "processo", "integração", "integracao"],
        "responses": [
            "Automação reduz trabalho manual e agiliza processos. Você quer integrar ferramentas, enviar relatórios ou automatizar vendas?",
            "Podemos criar rotinas automáticas para gerenciar leads, estoque ou atendimento. O que você deseja automatizar?",
        ],
    },
    {
        "keywords": ["contato", "atendimento", "ajuda", "suporte"],
        "responses": [
            "Posso te orientar sobre nosso processo: primeiro entendemos a ideia, depois criamos o projeto e entregamos com testes e deploy. Quer saber como começamos um novo projeto?",
            "Estamos disponíveis para conversar sobre o seu projeto e tirar dúvidas. Prefere que eu explique como funciona o primeiro atendimento?",
        ],
    },
    {
        "keywords": ["prazo", "tempo", "quando", "semana", "meses"],
        "responses": [
            "O prazo depende do escopo, mas pequenos projetos costumam ficar prontos em poucas semanas. Quer que eu estime um prazo para a sua ideia?",
            "Normalmente entregamos sites simples em até 3 semanas e sistemas em até 6 semanas, dependendo da complexidade. Qual é a sua necessidade?",
        ],
    },
    {
        "keywords": ["seo", "busca", "google", "rank", "aumentar"],
        "responses": [
            "Trabalhamos SEO técnico e de conteúdo para que seu site apareça melhor no Google. Quer saber como otimizar suas páginas?",
            "SEO é parte do desenvolvimento. Posso te explicar como deixamos seu site rápido e fácil de encontrar na pesquisa.",
        ],
    },
    {
        "keywords": ["portfolio", "portfólio", "projetos", "trabalhos", "cases"],
        "responses": [
            "Temos experiência em sites, sistemas e automações. Você quer ver exemplos de projetos parecidos com o seu?",
            "Posso te contar sobre projetos anteriores que ajudaram empresas a crescer online. Qual tipo de solução você mais gosta?",
        ],
    },
    {
        "keywords": ["design", "visual", "ux", "ui", "experiência", "experiencia"],
        "responses": [
            "Criamos layouts limpos, modernos e fáceis de usar. Deseja um design mais corporativo ou algo mais criativo?",
            "A experiência do usuário é prioridade. Posso adaptar o visual para sua marca e público-alvo.",
        ],
    },
    {
        "keywords": ["equipe", "quem", "empresa", "noven"],
        "responses": [
            "Somos a Noven Labs: desenvolvemos sites, sistemas e automações para empresas que querem crescer com tecnologia. Quer saber mais sobre nossa forma de trabalho?",
            "Nossa equipe é focada em entrega ágil e qualidade. Posso te falar sobre o processo de desenvolvimento e comunicação?",
        ],
    },
    {
        "keywords": ["olá", "ola", "oi", "bom", "boa", "salve"],
        "responses": [
            "Olá! Em que posso ajudar você hoje?",
            "Oi! Como posso te ajudar com seu projeto?",
            "Olá! Quer saber sobre orçamentos, sites ou automações?",
        ],
    },
    {
        "keywords": ["obrigado", "obrigada", "vlw", "legal", "show"],
        "responses": [
            "Que bom que gostou! Se quiser, posso esclarecer mais alguma dúvida.",
            "Fico feliz em ajudar! Tem mais alguma pergunta sobre seu projeto?",
        ],
    },
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
