from concurrent import futures
import service_pb2_grpc
import service_pb2
import grpc



class AudioRPCServer(service_pb2_grpc.AudioSTTServiceServicer):

    def SendAudio(self, request_iterator, context):
        for i in request_iterator:
            print(i)

        return service_pb2.AudioSubbedInfo(long_text="hello", segments=[service_pb2.ResultSegment(text="hey", start="2", end="3")])


def serve():
    port = "50051"
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    service_pb2_grpc.add_AudioSTTServiceServicer_to_server(AudioRPCServer(), server)
    server.add_insecure_port("[::]:" + port)
    server.start()

    print("Server started, listening on " + port)
    server.wait_for_termination()


if __name__ == "__main__":
    serve()