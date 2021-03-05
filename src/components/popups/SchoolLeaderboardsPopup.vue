<template>
  <PopupWrap :open="open" @update:open="val => {$emit('close'); $emit('update:open', val)}">
    <div class="wrap mx-auto bg-white rounded">
      <div class="leaderboards p-6">
        <header style="display: flex">
          <i class="bx bxs-trophy" style="color: gold" />
          <h1>
            Leaderboard
          </h1>
        </header>
        <h2 class="text-xl mt-4 w-500">
          {{exam.name}}
        </h2>
        <Hint style="margin-top: 20px;">
          Only includes the schools with 2 or more attendees
        </Hint>
        <table class="leaderboards__table mt-6">
          <tbody>
            <tr v-for="([s, score], idx) in exam.leaderboards" :key="idx">
              <td>
                <div style="display: flex;">
                  <div style="margin-right: 20px;">
                    {{idx + 1}}.
                  </div>
                  <div>{{s.name}}</div>
                </div>
              </td>
              <td class="pl-4">
                {{score.toFixed()}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </PopupWrap>
</template>

<script>
export default {
  props: {
    open: null,
    exam: null
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 700px;
}
.leaderboards {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
  h1 {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 1.6rem;
    margin-left: 15px;
  }
  i {
    font-size: 3rem;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: black;
  }
  table {
    max-width: 700px;
  }
}
tbody tr {
  &:nth-child(even) {
    background: #f7f7f7;
  }
  font-weight: 400;
  font-size: 1.1rem;

  td {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
