<script>
  import ExamStudentSelect from "../../components/ExamStudentSelect.svelte";
import { Axios } from "../../services/axios";

  let name = '';
  export let students = [];
  let selectedStudents = [];

  async function submit() {
    const {id} = await Axios.$post('schools', {
      name
    });

    for (const student of selectedStudents) {
      await Axios.$post(`schools/${id}/students/${student}`);
    }
  }

  // $: {
  //   const nulls = Array()
  //   selectedStudents = [...new Set(selectedStudents), null]
  // }
</script>

<!-- <script context="module">
  export async function preload(page, session) {
    
    const students = await Axios.$get('students');

		return { students };
	}
</script> -->

<div>
  {JSON.stringify(selectedStudents)}
  <form on:submit|preventDefault={submit}>
    <input bind:value={name}>
    {#each [...selectedStudents, null] as _, i}
      <ExamStudentSelect bind:students bind:selected={selectedStudents[i]} />
    {/each}
    <button type="submit">
      Create
    </button>
  </form>
</div>