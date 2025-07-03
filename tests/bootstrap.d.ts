import { RunnerConfig } from '@japa/runner'

declare module '../tests/bootstrap' {
  export const runnerHooks: {
    setup: RunnerConfig['setup']
    teardown: RunnerConfig['teardown']
  }
  
  export const plugins: RunnerConfig['plugins']
  
  export default {
    plugins: RunnerConfig['plugins']
    runnerHooks: {
      setup: RunnerConfig['setup']
      teardown: RunnerConfig['teardown']
    }
    suites: RunnerConfig['suites']
  }
}