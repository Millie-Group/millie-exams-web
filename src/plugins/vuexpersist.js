import VuexPersistence from 'vuex-persist'

export default ({store}) => {
  new VuexPersistence({
    modules: ['question-submit', 'test']
  }).plugin(store);
}
