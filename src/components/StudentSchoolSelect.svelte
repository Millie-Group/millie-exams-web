<script>
  export let schools = [];
  export let selected = null;
</script>

<select bind:value={selected}>
  {#each schools as school}
    <option value={school.id}>
      {school.name}
    </option>
  {/each}
</select>