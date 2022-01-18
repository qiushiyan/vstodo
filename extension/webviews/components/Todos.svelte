<script lang="ts">
  import { onMount } from "svelte";
  import { crossfade } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { flip } from "svelte/animate";
  import type { Todo, User } from "../types";
  export let accessToken: string;

  let text = "";
  let todos: Todo[] = [];

  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
      };
    },
  });

  const addTodo = async (value: string) => {
    const response = await fetch(`${apiBaseUrl}/todo`, {
      method: "POST",
      body: JSON.stringify({ title: value }),

      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });
    text = "";

    const { newTodo } = await response.json();
    todos = [newTodo, ...todos];
  };

  const toggleTodo = async (id: number) => {
    await fetch(`${apiBaseUrl}/todo`, {
      method: "PUT",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  };

  const handleSubmit = async () => {
    addTodo(text);
  };

  onMount(async () => {
    const response = await fetch(`${apiBaseUrl}/todo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    const { data } = await response.json();
    todos = data;
  });

  onMount(() => {
    window.addEventListener(
      "message",
      async (event: MessageEvent<{ type: string; value: string }>) => {
        const message = event.data;
        switch (message.type) {
          case "new-todo":
          // const newTodos = message.value
          //   .split(",")
          //   .map((item) => ({ title: item, completed: false }));
          // todos = [...newTodos, ...todos];
        }
      }
    );
  });
</script>

<div>
  <form on:submit|preventDefault={() => handleSubmit()}>
    <input type="text" bind:value={text} />
  </form>

  <div class="uncompleted">
    {#if todos.length}
      <h2>Uncompleted</h2>
      <ul>
        {#each todos.filter((t) => !t.completed) as todo (todo.id)}
          <li
            on:click={() => toggleTodo(todo.id)}
            in:receive={{ key: todo.id }}
            out:send={{ key: todo.id }}
            animate:flip={{ duration: 200 }}
          >
            {todo.title}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  <div class="completed">
    {#if todos.length}
      <h2>Completed</h2>
      <ul>
        {#each todos.filter((t) => t.completed) as todo (todo.id)}
          <li
            on:click={() => toggleTodo(todo.id)}
            in:receive={{ key: todo.id }}
            out:send={{ key: todo.id }}
            animate:flip
          >
            {todo.title}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style>
  .completed li {
    text-decoration: line-through;
  }
</style>
