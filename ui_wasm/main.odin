package main

import "core:fmt"
import glm "core:math/linalg/glsl"
import "core:mem"
import gl "vendor:wasm/WebGL"

Global_Ctx :: struct {
	idx:        string,
	program:    gl.Program,
	data:       []f32,
	is_playing: bool,
	matrices:   []glm.mat4,
}

gctx: Global_Ctx
// arena: mem.Arena


// @(export)
// allc_data_size :: proc(size: u32) {
// 	arena_mem_alloc := mem.arena_allocator(&arena)
// 	gctx.data = make([]f32, size, arena_mem_alloc)
// }

// @(export)
// allc_data_len :: proc() -> int {
// 	return len(gctx.data)
// }

@(export)
set_sound_mem :: proc(ptr: ^[]f32, len: u32) {
	mem.copy(raw_data(gctx.data), ptr, int(len * 4))
}

@(export)
clean_sound_mem :: proc() {
	defer free(raw_data(gctx.matrices))
	// delete(gctx.data)
}

@(export)
step :: proc(delta_time: f64) -> (keep_going: bool = true) {
	num_of_matrices := len(gctx.data)

	gl.Clear(gl.COLOR_BUFFER_BIT)

	gctx.matrices = make([]glm.mat4, num_of_matrices)

	min_v: f32 = -0.0
	max_v: f32 = +0.0
	for i in gctx.data {
		min_v = min(min_v, i)
		max_v = max(max_v, i)
	}

	for i in 0 ..< num_of_matrices {

		x_pos := (f32(i) / f32(max(num_of_matrices - 1, 1))) * 2.0 - 1.0
		normalized_height := clamp((gctx.data[i] - min_v) / (max_v - min_v), 0.0, 1.0)

		min_height: f32 = 0.02
		normalized_height = max(min_height, normalized_height)

		temp := glm.identity(glm.mat4)
		translate := glm.mat4Translate({x_pos, normalized_height / 2 - 1, 0})
		scale := glm.mat4Scale({(1 / f32(num_of_matrices)) / 5, normalized_height, 1})
		gctx.matrices[i] = temp * translate * scale
	}

	// if gctx.is_playing {
	draw(gctx.matrices)
	// }

	return
}


draw :: proc(matrices: []glm.mat4) {

	// rectangle shape
	rect_vect: []f32 = {-1, -1, -1, 1, +1, +1, +1, -1}
	idxs: []u16 = {0, 1, 2, 0, 2, 3}
	color: [4]f32 = {0.0, 0.0, 0.0, 1.0}

	gl.UseProgram(gctx.program)


	// position buffer
	position_buffer := gl.CreateBuffer()
	gl.BindBuffer(gl.ARRAY_BUFFER, position_buffer)
	gl.BufferData(
		gl.ARRAY_BUFFER,
		size_of(f32) * len(rect_vect),
		raw_data(rect_vect),
		gl.STATIC_DRAW,
	)


	// matrix buffer
	matrix_buffer := gl.CreateBuffer()
	gl.BindBuffer(gl.ARRAY_BUFFER, matrix_buffer)
	gl.BufferData(
		gl.ARRAY_BUFFER,
		len(matrices) * size_of(glm.mat4),
		raw_data(matrices),
		gl.STATIC_DRAW,
	)

	// idx buffer
	idx_buffer := gl.CreateBuffer()
	gl.BindBuffer(gl.ELEMENT_ARRAY_BUFFER, idx_buffer)
	gl.BufferData(
		gl.ELEMENT_ARRAY_BUFFER,
		len(idxs) * size_of(u16),
		raw_data(idxs),
		gl.STATIC_DRAW,
	)


	{
		loc := gl.GetAttribLocation(gctx.program, "a_position")
		gl.BindBuffer(gl.ARRAY_BUFFER, position_buffer)
		gl.VertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
		gl.EnableVertexAttribArray(loc)
	}

	{
		loc := gl.GetUniformLocation(gctx.program, "u_color")
		gl.Uniform4fv(loc, color)
	}

	{
		loc := gl.GetAttribLocation(gctx.program, "a_matrix")
		gl.BindBuffer(gl.ARRAY_BUFFER, matrix_buffer)

		for i in 0 ..< 4 {
			curr_loc := loc + i32(i)
			offset := uintptr(i * 4 * size_of(f32))
			gl.VertexAttribPointer(curr_loc, 4, gl.FLOAT, false, size_of(glm.mat4), offset)
			gl.EnableVertexAttribArray(curr_loc)
			gl.VertexAttribDivisor(u32(curr_loc), 1)
		}

	}

	gl.BindBuffer(gl.ELEMENT_ARRAY_BUFFER, idx_buffer)
	// gl.DrawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, nil)
	gl.DrawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, len(matrices))
}


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

	gctx.data = make([]f32, 64)
	defer delete(gctx.data)

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
