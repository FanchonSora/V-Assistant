# utils/antlr_gen.py
import os
import subprocess
import logging
import time

LOG = logging.getLogger("antlr_gen")

# Path tới file JAR (có thể override bằng env var)
ANTLR_JAR = os.getenv(
    "ANTLR_JAR_PATH",
    r"C:\Program Files\antlr\antlr4-4.13.2-complete.jar"
)
BASE_DIR     = os.path.abspath(os.path.dirname(__file__))
GRAMMAR_FILE = os.path.join(BASE_DIR, "..", "gen", "AssistantDSL.g4")
OUTPUT_DIR   = os.path.join(BASE_DIR, "..", "gen", "assistantdsl")
LEXER_FILE   = os.path.join(OUTPUT_DIR, "AssistantDSLLexer.py")

def generate():
    LOG.info("Checking ANTLR parser…")
    # Nếu đã có lexer & mới hơn grammar thì bỏ qua
    if os.path.exists(LEXER_FILE):
        if os.path.getmtime(LEXER_FILE) >= os.path.getmtime(GRAMMAR_FILE):
            LOG.info("ANTLR parser up-to-date; skipping.")
            return

    LOG.info("Generating ANTLR parser…")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    cmd = [
        "java", "-jar", ANTLR_JAR,
        "-Dlanguage=Python3",
        "-visitor",
        "-o", OUTPUT_DIR,
        GRAMMAR_FILE,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        LOG.error("ANTLR failure: %s", result.stderr)
        raise RuntimeError("ANTLR generation error")
    # Cập nhật timestamp để tránh watch-trigger vòng lặp
    now = time.time()
    os.utime(OUTPUT_DIR, (now, now))
    LOG.info("ANTLR parser generated successfully.")
