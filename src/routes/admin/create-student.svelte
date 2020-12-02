<script>
import { Axios } from "../../services/axios";

  let name = '';
  let email = '';

  async function submit() {
    await Axios.$post('students', {
      name, email
    })
  }
</script>

<div>
  <form on:submit|preventDefault={submit}>
    <input bind:value={name}>
    <input bind:value={email}>
    <button type="submit">
      Create
    </button>
  </form>
</div>