# from utils.transc import TTSModel
from conf.logger import logger
from rpc import server

if __name__ == "__main__":
    server.serve()
    # tsm = TTSModel()

    # res = tsm.transcribe("./asset/media_audio.mp3")
    # res2 = tsm.transcribe("./asset/media_audio.mp3")

    # print(res, res2)