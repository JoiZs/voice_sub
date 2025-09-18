from concurrent import futures

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

        print(request.ByteSize())
        print(request.audio_buff)
        res_message = service_pb2.ResponseInfo()

        if (request.ByteSize() <= 0):
            res_message.e_message.error = "Input must be provided"
            return res_message

        # try:
        #     res = self.model.transcribe()
        # except Exception as e :
        #     print(e)

        res_message.res_message.long_text = "sup>?"

        return res_message

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