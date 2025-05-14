import os
import subprocess
import logging
import time

LOG = logging.getLogger("antlr_gen")

# Cấu hình
ANTLR_JAR    = os.getenv(
    "ANTLR_JAR_PATH",
    r"C:\Program Files\antlr\antlr4-4.13.2-complete.jar"
)
# tuyệt đối cho dễ
BASE_DIR     = os.path.abspath(os.path.dirname(__file__))
GRAMMAR_FILE = os.path.join(BASE_DIR, "..", "gen", "AssistantDSL.g4")
OUTPUT_DIR   = os.path.join(BASE_DIR, "..", "gen", "assistantdsl")
LEXER_FILE   = os.path.join(OUTPUT_DIR, "AssistantDSLLexer.py")

def generate():
    """
    Chỉ chạy ANTLR nếu:
      - CHƯA TỒN TẠI parser (Output dir trống), hoặc
      - GRAMMAR_FILE có thời gian sửa > LEXER_FILE (grammar mới)
    """
    LOG.info("Checking ANTLR parser…")

    # nếu đã tồn tại và parser cũ không "lỗi", skip
    if os.path.exists(LEXER_FILE):
        g_mtime = os.path.getmtime(GRAMMAR_FILE)
        l_mtime = os.path.getmtime(LEXER_FILE)
        if l_mtime >= g_mtime:
            LOG.info("ANTLR parser up-to-date; skipping generation.")
            return

    LOG.info("Generating ANTLR parser…")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # build command
    cmd = [
        "java",
        "-jar", ANTLR_JAR,
        "-Dlanguage=Python3",
        "-visitor",
        "-o", OUTPUT_DIR,
        GRAMMAR_FILE,
    ]
    LOG.debug("Running command: %s", " ".join(cmd))

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        LOG.error("ANTLR generation failed (stderr):\n%s", result.stderr)
        raise RuntimeError("ANTLR generation error")

    # touch a file so WatchFiles sees no change (avoid infinite reload)
    now = time.time()
    os.utime(OUTPUT_DIR, (now, now))
    LOG.info("ANTLR parser generated successfully.")
