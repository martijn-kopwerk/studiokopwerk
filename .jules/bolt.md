# Bolt's Journal - Critical Learnings

## 2025-09-01 - Canvas Animation Pre-allocations & Math Optimizations
**Learning:** In canvas animation loops (`request_AnimationFrame`), allocating objects or arrays inside the loop frame (e.g. `const linePoints: {x: number, y: number}[] = []` every frame) creates garbage collection pressure. Furthermore, repeated `Math.sqrt` inside $O(N^2)$ pairwise distance loops can be avoided or optimized by operating on squared distance first, and precalculating trigonometric values or pre-allocating point buffers.
**Action:** Reuse arrays/objects where possible in animation loops and use squared distance comparisons (`distSq < connectDistSq`) before calling `Math.sqrt`.
