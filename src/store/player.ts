import { Action, Module, VuexModule } from "vuex-module-decorators";

@Module
export default class Player extends VuexModule {
  @Action
  qwe(action) {
    console.log(action);
  }
}
