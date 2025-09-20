from concurrent import futures
import io

import ffmpeg
import numpy as np
from regex import R
from . import service_pb2_grpc
from . import service_pb2
import grpc
from utils.transc import TTSModel

class AudioRPCServer(service_pb2_grpc.AudioSTTServiceServicer):
    
    def __init__(self):
        super().__init__()
        self.model = TTSModel()

    def SendAudio(self, request: service_pb2.AudioFileInfo, context) -> service_pb2.ResponseInfo:

        res_info = service_pb2.ResponseInfo()

        if (request.ByteSize() <= 0):
            res_info.e_message.error = "Input must be provided"
            return res_info 

        try:
            input_stream = io.BytesIO(request.audio_buff)
            out, _ = (
                        ffmpeg
                        .input('pipe:0')
                        .output('pipe:1', format='f32le', acodec='pcm_f32le', ac=1, ar='16000')
                        .run(input=input_stream.read(), capture_stdout=True, capture_stderr=True)
                    )

            audio_arr = np.frombuffer(out, np.float32)

            res = self.model.transcribe(audio_arr)
            print(res.text, str(res.segments))

            audio_sub = service_pb2.AudioSubbedInfo()
            audio_sub.long_text = res.text

            print(audio_sub)
            for i in res.segments:
                one_seg = audio_sub.segments.add()
                one_seg.text = i.text
                one_seg.start = i.start
                one_seg.end = i.end
                print("audio_arr: ", i)

            print(audio_sub)
            res_info.res_message.CopyFrom(audio_sub)
        except Exception as e :
            print(e)
            res_info.e_message.error = str(e)

        return res_info

        # return service_pb2.AudioSubbedInfo(long_text="hello", segments=[service_pb2.ResultSegment(text="hey", start="2", end="3")])


def serve():
    port = "50051"
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    service_pb2_grpc.add_AudioSTTServiceServicer_to_server(AudioRPCServer(), server)
    server.add_insecure_port("[::]:" + port)
    server.start()

    print("Server started, listening on " + port)
    server.wait_for_termination()


# if __name__ == "__main__":
#     serve()