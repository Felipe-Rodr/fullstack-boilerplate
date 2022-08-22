import { createRouter } from '../createRouter'
import { playerRouter } from './playerRouter';

export const appRouter = createRouter()
    .merge('player.', playerRouter)
;
// export type definition of API
export type AppRouter = typeof appRouter;