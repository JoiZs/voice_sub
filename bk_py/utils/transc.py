from numpy import ndarray
import stable_whisper as sw


class TTSModel(object):

    def __init__(self):
        self.model = sw.load_model("tiny.en", download_root="./model")

    def __new__(cls):
        if not hasattr(cls, "instance"):
            cls.instance = super(TTSModel, cls).__new__(cls)
        return cls.instance

    def transcribe(self, audio:str | ndarray) -> "sw.WhisperResult":
        result = self.model.transcribe(audio)
        return result
    