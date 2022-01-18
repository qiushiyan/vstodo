<script lang="ts">
  import { onMount } from "svelte";
  import type { PostMessage, User } from "../types";
  import Todos from "./Todos.svelte";

  let loading = true;
  let accessToken = "";
  let user: User | null = null;

  const clearToken = () => {
    tsvscode.postMessage({ type: "clearToken" });
    user = null;
  };

  const login = () => {
    tsvscode.postMessage({ type: "authenticate" });
  };

  onMount(async () => {
    window.addEventListener(
      "message",
      async (event: MessageEvent<PostMessage>) => {
        const message = event.data;
        switch (message.type) {
          case "token":
            accessToken = message.value;
            const response = await fetch(`${apiBaseUrl}/me`, {
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            });
            const data = await response.json();
            if (data.user) {
              user = data.user;
            }
            loading = false;
        }
      }
    );

    // ask for token
    tsvscode.postMessage({ type: "getToken" });
  });
</script>

<main>
  {#if loading}
    <div>loading ...</div>
  {:else if user}
    <div>
      <p>{user.name}</p>
      <button on:click={() => clearToken()}>log out</button>
    </div>
    <Todos {accessToken} />
  {:else}
    <div>no user is logged in</div>
    <button on:click={() => login()}>log in</button>
  {/if}
</main>

<style>
</style>
