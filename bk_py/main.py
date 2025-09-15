from conf.logger import logger
import stable_whisper as sw

if __name__ == "__main__":

    model = sw.load_model("tiny.en", download_root="./model")

    result = model.transcribe("./asset/media_audio.mp3")

    for i in result:
        
        print(i)