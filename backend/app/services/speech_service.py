import os
import tempfile
from pydub import AudioSegment
import speech_recognition as sr

class SpeechService:
    def __init__(self, lang: str = "en-US"):
        self.recognizer = sr.Recognizer()
        self.lang = lang

    def listen_and_transcribe(self, timeout: float = 5.0) -> str:
        """
        Mở microphone, nghe giọng nói, trả về text.
        """
        with sr.Microphone() as mic:
            # Bỏ tạp âm nền
            self.recognizer.adjust_for_ambient_noise(mic, duration=0.5)
            print("Listening...")
            audio = self.recognizer.listen(mic, timeout=timeout)
        try:
            # Dùng Google Web Speech API (miễn phí, có rate-limit)
            text = self.recognizer.recognize_google(audio, language=self.lang)
            return text
        except sr.UnknownValueError:
            return "[Không nghe rõ]"
        except sr.RequestError as e:
            return f"[Lỗi API: {e}]"

    def transcribe_file(self, file_path: str) -> str:
        """
        Chuyển file âm thanh (có thể không phải wav) thành text.
        Nếu file không phải wav, sẽ chuyển đổi sang wav sử dụng pydub.
        """
        # Nếu file không ở định dạng wav, chuyển nó sang wav trong thư mục tạm.
        ext = os.path.splitext(file_path)[1].lower()
        if ext != ".wav":
            try:
                sound = AudioSegment.from_file(file_path)
                with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                    tmp_path = tmp.name
                sound.export(tmp_path, format="wav")
                file_path = tmp_path
            except Exception as e:
                return f"[Lỗi chuyển đổi file: {e}]"

        # Sau đó, sử dụng file wav để nhận dạng
        with sr.AudioFile(file_path) as src:
            audio = self.recognizer.record(src)
        try:
            return self.recognizer.recognize_google(audio, language=self.lang)
        except sr.UnknownValueError:
            return "[Không nghe rõ]"
        except sr.RequestError as e:
            return f"[Lỗi API: {e}]"