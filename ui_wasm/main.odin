package main

import "core:fmt"
import "core:mem"
import gl "vendor:wasm/WebGL"

Global_Ctx :: struct {
	idx:     string,
	program: gl.Program,
	data:    []f32,
}

gctx: Global_Ctx
arena: mem.Arena


@(export)
allc_data_size :: proc(size: u32) {
	arena_mem_alloc := mem.arena_allocator(&arena)
	gctx.data = make([]f32, size, arena_mem_alloc)
}

@(export)
allc_data_len :: proc() -> int {
	return len(gctx.data)
}

@(export)
set_sound_mem :: proc(ptr: ^f32, len: u32) {
	mem.copy(raw_data(gctx.data), ptr, int(len * 4))
}

// draw :: proc() {

// }

main :: proc() {
	fmt.println("Hello from odin...")

	track: mem.Tracking_Allocator
	mem.tracking_allocator_init(&track, context.allocator)
	context.allocator = mem.tracking_allocator(&track)

	defer {
		if (len(track.allocation_map) > 0) {
			fmt.eprintf("=== %v allocations not freed: ===\n", len(track.allocation_map))
			for _, leak in track.allocation_map {
				fmt.printf("%v leaked %m\n", leak.location, leak.size)
			}
		}

		mem.tracking_allocator_destroy(&track)
	}

	gctx.idx = "drawingCanvas"
	ok: bool

	ok = gl.CreateCurrentContextById(gctx.idx, gl.DEFAULT_CONTEXT_ATTRIBUTES)
	assert(ok, "Err creating current context")

	ok = gl.SetCurrentContextById(gctx.idx)
	assert(ok, "Err setting current context")

	gctx.program, ok = gl.CreateProgramFromStrings({vert_shader}, {frag_shader})
	assert(ok, "Err creating program from shader strings...")


	arena_mem := make([]byte, 1024)
	mem.arena_init(&arena, arena_mem)

	defer delete(arena_mem)

}

vert_shader := `
precision mediump float;
attribute vec2 a_position;
attribute mat4 a_matrix;

void main(){
	gl_Position = a_matrix * vec4(a_position, 0, 1);
}
`


frag_shader := `
precision mediump float;
uniform vec4 u_color;

void main(){
	gl_FragColor = u_color;
}
`
