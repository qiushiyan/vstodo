<script lang="ts">
  import { fly } from "svelte/transition";
  let number = 0;

  const increment = () => {
    number++;
  };

  import "../styles/app.css";
</script>

<h1 class="text-3xl font-bold underline">Hello world!</h1>
<button on:click={increment} class="btn btn-primary">increment</button>
<div class="avatar placeholder">
  <div class="bg-neutral-focus text-neutral-content rounded-full w-32 h-32">
    <span class="text-3xl">K</span>
  </div>
</div>

<p>
  number is {#key number}<span in:fly={{ y: -20 }}>{number}</span>{/key}
</p>

<style>
</style>
