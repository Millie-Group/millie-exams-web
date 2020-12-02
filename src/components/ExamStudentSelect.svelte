<script>
  export let students = [];
  export let selected = null;
  export let onchange = () => {};
</script>

<!-- svelte-ignore a11y-no-onchange -->
<div>
  <select bind:value={selected} on:blur={onchange}>
    <option value={null}>
      ---
    </option>
    {#each students as student}
      <option value={student}>
        {student.name} ({student.email})
      </option>
    {/each}
  </select>
</div>