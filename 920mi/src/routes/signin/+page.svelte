<script>
  import { signIn } from "@auth/sveltekit/client";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  let email = '';
  let password = '';
  let loading = false;
  let error = '';

  // If the user is already logged in, redirect them.
  $: if ($page.data.session) {
    const callbackUrl = $page.url.searchParams.get('callbackUrl') || '/';
    goto(callbackUrl, { replaceState: true });
  }

  // Read error from URL on page load
  $: {
    const urlError = $page.url.searchParams.get('error');
    if (urlError && !error) {
      error = urlError;
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    
    if (!email || !password) {
      error = 'Please enter both email and password.';
      return;
    }

    loading = true;
    error = '';

    try {
      const result = await signIn('custom-credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        error = result.error;
      } else if (result?.ok) {
        const callbackUrl = $page.url.searchParams.get('callbackUrl') || '/';
        await goto(callbackUrl);
      }
    } catch (err) {
      error = 'An unexpected error occurred during login.';
      console.error('Login process error:', err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-center">Sign In</h1>
    <form on:submit={handleLogin} class="space-y-6">
      {#if error}
        <div class="p-3 my-2 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      {/if}
      <div>
        <Label for="email">Email</Label>
        <Input type="email" id="email" name="email" bind:value={email} required disabled={loading} />
      </div>
      <div>
        <Label for="password">Password</Label>
        <Input type="password" id="password" name="password" bind:value={password} required disabled={loading} />
      </div>
      <Button type="submit" disabled={loading} class="w-full">
        {#if loading}
          Signing In...
        {:else}
          Sign In
        {/if}
      </Button>
    </form>
  </div>
</div>