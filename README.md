# Express-Ollama

Express-Ollama is an open-source example project demonstrating the implementation of local LLM (Large Language Model) using Ollama, full offline, and ready to integrate with any document, regulation, or law database. This project showcases:

- Automatic parsing and chunking of PDF files
- Local embedding generation using Ollama's embedding model
- Embedding and document storage to SQL database (MySQL/PostgreSQL)
- Full-text search and semantic search (vector similarity)
- Question-answering (QA) API powered by local LLM (Ollama)

---

## Features

- **Fully offline**: All AI/embedding/QA runs on your machine
- **Express.js backend**: Simple and easy to extend
- **LLM & embedding local**: No paid API, use Ollama on your Mac/PC/server
- **Works with regulations, legal docs, books, or any PDF**
- **API endpoint for QA**: `/ask` endpoint for intelligent question-answering

---

## Requirements

- Node.js (18+ recommended)
- MySQL or PostgreSQL
- [Ollama](https://ollama.com/) (installed locally)
- Docker (recommended for running database/vector DB)
- Git

---

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/NeaByteLab/Express-Ollama.git
cd Express-Ollama
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install & Run Ollama

Download and install Ollama from [https://ollama.com/download](https://ollama.com/download)

Run Ollama:

```bash
ollama serve
```

### 4. Pull Required Models

Pull the latest LLM & embedding models:

```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

### 5. Configure .env

Edit `.env` with your database connection, example:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=express_ollama
OLLAMA_URL=http://localhost:11434
PORT=8080
```

### 6. Run Database Migration (Knex)

```bash
npx knex migrate:latest --knexfile knexfile.js
```

### 7. Start Service

Run the main script:

```bash
node index.js
```

### 8. Add Your PDF Files

- Place your PDF files in the `dataset/` folder.
- No need for a watcher service—just put the files and run the service to (re)process your dataset.
- The service will automatically scan and process all PDF files in `dataset/` on start.

### 9. Try the QA API

POST to `http://localhost:8080/ask` with JSON:

```json
{ "query": "Apa isi utama Peraturan Pemerintah tentang ..." }
```

---

## Project Structure

```
.
├── config/
│   └── db.js
├── dataset/
│   └── [your-pdf-files.pdf]
├── db/
│   └── migrations/
│       └── 001_init.js
├── helpers/
│   ├── ollama.js
│   └── parsePdf.js
├── index.js
├── knexFile.js
├── package.json
├── service/
│   └── pipeline.js
```

---

## Project Flow (How It Works)

1. **PDF Ingestion**

   - Place PDF files into the `dataset/` folder.
   - The main service (`index.js`) will scan and process all PDF files on startup.
   - No background watcher required—just add files to `dataset/` before running, or rerun service after adding new files.

2. **PDF Parsing & Chunking**

   - Each PDF is parsed using the helper in `helpers/parsePdf.js`.
   - The content is split into chunks (e.g. per page or per 500 words) for optimal semantic processing.

3. **Embedding Generation**

   - Each text chunk is sent to Ollama (`helpers/ollama.js`) to generate vector embeddings using `nomic-embed-text`.

4. **Database Storage**

   - Metadata, text chunks, and their embeddings are saved to your SQL database (MySQL/PostgreSQL) via Knex (`config/db.js`).
   - All migration/schema is managed in `db/migrations/`.

5. **Question Answering API**

   - User sends a POST request to `/ask` (handled in `index.js` or your Express API layer).
   - The system:
     - Embeds the user query (with Ollama)
     - Searches the most relevant text chunks from the database using full-text search and/or cosine similarity on embeddings
     - Selects top-N best-matching chunks as context
     - Builds a prompt for the LLM model (e.g. llama3.2 via Ollama)
     - Generates and returns the answer to the user

6. **Result Delivery**

   - The user receives the answer and (optionally) reference to the most relevant documents/chunks.

---

## License

MIT © [NeaByteLab](https://github.com/NeaByteLab)