build_react:
	protoc -I. --js_out=import_style=commonjs:../ui/src/generated/rpc --grpc-web_out=import_style=typescript,mode=grpcwebtext:../ui/src/generated/rpc service.proto

build_py:
	..\bk_py\.venv\Scripts\python.exe -m grpc_tools.protoc -I. --python_out=../bk_py/rpc --pyi_out=../bk_py/rpc --grpc_python_out=../bk_py/rpc service.proto

start_proxy:
	grpcwebproxy --backend_addr=localhost:50051 --run_tls_server=false --allow_all_origins