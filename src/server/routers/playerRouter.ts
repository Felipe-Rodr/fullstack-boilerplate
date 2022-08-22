import { Prisma } from '@prisma/client';
import { deleteCookie, setCookie } from 'cookies-next';
import { z } from 'zod';
import { createRouter } from "../createRouter";

const defaultPlayerSelect = Prisma.validator<Prisma.playerSelect>()({
    id: true,
    createdAt: true,
    maxScore: true
});

export const playerRouter = createRouter()
    .mutation('addPlayer', {
        async resolve({ctx}) {
            try{
                const player = await ctx.prisma.player.create({
                    data: {},
                });
                setCookie('qid', player.id,{
                    req: ctx.req,
                    res: ctx.res,
                    maxAge:60*6*24
                });
                return 1;
            } catch {
                return 0;
            }
            
        },
    })
    .mutation('deletePlayerById',{
        input: z.object({
            id: z.number()
        }),
        async resolve({ctx, input}){
            try{
                await ctx.prisma.player.delete({
                    where:input
                });
                deleteCookie('qid',{
                    req: ctx.req,
                    res: ctx.res
                })
                return 1;
            } catch {
                return 0;
            }
        }
    })
    .query('getPlayerById', {
        input: z.object({
            id: z.number().default(0)
        }),
        async resolve({ctx, input}){
            try{
                const Player = await ctx.prisma.player.findUnique({
                    where:input
                });
                return Player;
            } catch {
                return 0;
            }
        }
    })
    .query('getAllPlayers',{
        async resolve({ctx}){
            const player = await ctx.prisma.player.findMany({
                select: defaultPlayerSelect
            });
            console.log(player)
            return player
        },
    });